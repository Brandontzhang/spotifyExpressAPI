### Tracking issues and how I fixed them

## Setting up the project
  1. Dependencies: express, @types/express, typescript, ts-node
  2. Setting up the tsconfig and package.json
  3. Setting up the correct scripts in package.json to run the server

## Adding middleware to parse request bodies sent from Postman
  - Express has middleware made for processing different types of bodies sent through requests
  - Set them up by with the use function:
    - Ex. app.use(express.json());
  
## Converting a curl request into an Axios request
  - For requests, separate out the data for the body request and the headers
  - Axios requests follow the formats:
    1. Get: axios.get(url, { headers });
    2. Post. axios.post(url, data, { headers });

## Express get requests. Handling params vs queries
  - Params are included in the express url 
    - Ex. /user/:userId/username/:username
    - Accessed with req.params
  - Queries are sent over without limit
    - Ex. /search?query=queryString&ids=id1,id2,id3&type=type%20type2
    - Accessed with req.query
