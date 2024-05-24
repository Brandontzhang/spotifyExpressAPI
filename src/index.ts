import express, { Request, Response } from "express";
import axios from "axios";

const app = express();

// Middleware for parsing different bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
let accessToken: AccessToken | null = null;

interface AccessToken {
  access_token: string,
  token_type: string,
  expires_in: number,
}

const getAccessToken = (): AccessToken => {
  if (accessToken) {
    return accessToken;
  } else {
    throw new Error("No access token");
  }
}

app.get('/', (req, res) => {
  res.send('Hello world lmao');
});

app.post('/accesstoken', async (req: Request, res: Response) => {
  const { clientId, clientSecret } = req.body;

  try {
    const url = "https://accounts.spotify.com/api/token";
    const body = {
      "client_id": clientId,
      "client_secret": clientSecret,
      "grant_type": 'client_credentials'
    }
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    }

    const response = await axios.post(url, body, { headers });

    accessToken = response.data;
    res.status(200).send(response.data);
  } catch (error: any) {
    console.log("Fetch access token error", error);
    res.status(500).send(error);
    throw new Error(error);
  }
});

app.get('/artist/:id', async (req: Request, res: Response) => {
  const artistId = req.params.id;

  const { token_type, access_token } = getAccessToken();

  try {
    const url = `https://api.spotify.com/v1/artists/${artistId}`;
    const headers = {
      Authorization: `${token_type} ${access_token}`,
    };

    const response = await axios.get(url, { headers });

    res.status(200).send(response.data);
  } catch (error: any) {
    console.log("Fetch artist error", error);
    res.status(500).send(error);
    throw new Error(error);
  }
});

interface reqQuery {
  [key: string]: undefined | string | string[] | reqQuery | reqQuery[];
}

const generateSearchUrl = (requestQuery: reqQuery) => {
  const query: string = requestQuery.query as string;
  const type: string = requestQuery.type as string;
  const market: string = requestQuery.market as string;
  const limit: number = parseInt(requestQuery.limit as string);
  const offset: number = parseInt(requestQuery.offset as string);
  const include_external: string = requestQuery.include_external as string;

  let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}`;

  url += market ? `&market=${market}` : "";
  url += limit ? `&limit=${limit}` : "";
  url += offset ? `&offset=${offset}` : "";
  url += include_external ? `&include_external=${include_external}` : "";

  return url;
}

app.get('/search', async (req: Request, res: Response) => {
  if (!req.query.query || !req.query.type) {
    console.log("Missing query or type");
    res.status(400).send("Invalid input, please provide a query and a type");
    return;
  }

  const { token_type, access_token } = getAccessToken();
  try {
    const url = generateSearchUrl(req.query);
    const headers = {
      Authorization: `${token_type} ${access_token}`,
    };

    const response = await axios.get(url, { headers });

    return res.status(200).send(response.data);
  } catch (error: any) {
    console.log("Search error", error);
    res.status(500).send(error);
    throw new Error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
