# Carto Software Challenge

## Contact
* Author - Miguel Vaamonde
* Email - mvaamfer@gmmail.com

## Challenges summary

### Endpoint 1 + Authentication
At this point you need to develop an endpoint that will return a BigQuery Table
in a GeoJSON format.
Parameters of the endpoint:
* tableFQN (mandatory): FQN of the table
* geoColumn (optional): name of the geography column. Default to geog.

BigQuery works with very large tables (up to PB of data), in this test the API
should be limited to only support small datasets. The GeojsonLayer of deck.gl
downloads all the data into the browser memory, so your limit should be based
on this.

### Endpoint 2 + Authentication
At this point we want you to develop an endpoint that will return the tiles of a
tileset in CARTO.

Parameters of the endpoint:
* tilesetFQN (mandatory): FQN of the tileset
* z,x, y (mandatory): tile

---

## Development summary

### Architecture

I have created a simple application based in the clean architecture pattern, with three main modules:
* application - Module that houses the application use cases
* domain - Module that houses the main domain definitions of the application - entities, interfaces, etc
* infrastructure - Module that houses the implementation details of the application.

### Code language & dependencies
This application was build using nodeJs + typescript.

Node & npm versions:
* Node - v20.10.0
* Npm - v10.2.5

Main dependencies used:
* express - light web framework
* dotenv - environment variables
* axios - http client
* jsonwebtoken - for generating login tokens
* swagger - API documentation
* jest - testing

### Development decisions & considerations

#### Considerations

**Carto Workspace**

As required, I took a look to all the required CARTO documentation. Therefore, I have created a CARTO workspace which I have used in this challenge:
* A machine vs machine connection is available - cliend id + secret
* An API token is also available

#### Decisions

**Authentication**

I have created one login endpoint to be able to simulate an authentication against this application:
* POST endpoint
* It sends the user credentials to the application
* The application validate these credentials and if they are correct, it generates a JWT with the user role as a claim
  * NOTES:
    * The application does not integrate with another external application like LDAP
    * The accepted users are hardcoded - Please check: /application/authenticationUseCase.ts

**Authorization**

I have checked your documentation about how to integrate an application with carto, specially about how we can limit the logged user using specific grants (
https://docs.carto.com/carto-for-developers/guides/integrate-carto-in-your-existing-application), but I have decided to make it a bit simple for this challenge:
* PRE-REQUISITE - The user must be logged in the system (JWT TOKEN with roles. Explained before)
* For the authorization step I have implemented a PRE-authorize step based in the user roles
  * Each endpoint has configured some allowed ROLES. This means that only a user with those roles can execute each endpoint
    * Please take a look to /infrastructure/conf/preAuthorizeConf.ts & to /application/authorizationUseCase.ts
* If the PRE-authorize validation was successful, then the system will create an access_token using the client configurated in my carto workspace (client id + secret)
  * this access token will be used to communicate with the CARTO API

**Endpoints**

I have created three endpoints to respond to everything requested in the test:

* /login
  * Endpoint which retrieves a JWT token with the user role
    * only the hardcoded users can be used
* /tables/{tableFqn}/geoJson
  * Endpoint which retrieves the big query table data in geojson format
    * It retrieves the big query data in small subsets based in the limit and offset parameters
  * Required headers
    * Authorization Bearer (login token)
  * Required parameters
    * tableFqn - path parameter
  * Optional parameters
    * limit - query parameter (default and max value: 100)
    * offset - query parameter (default value: 0)
    * geoColumn - query parameter
* /tiles/{tilesetFqn}
  * Endpoint which retrieves the tiles of a tile set
  * Required headers
    * Authorization Bearer (login token)
  * Required parameters
    * tilesetFqn - path parameter
    * x - query parameter
    * y - query parameter
    * z - query parameter

**Problems faced**

I had some problems to successfully test the get tiles endpoint. 
It seems that the param partition is required (and I was forced to hardcoded it) ... and the CARTO API was retrieving aan 403 when using the access token generated with the machine to machine client credentials. Therefore, to unblock this endpoint, I have used the API token that i also create in my CARTO workspace.

### API documentation

I used swagger to document all the endpoints available in this application, using the OPEN API standard.

You can check the documentation using any of the following options:
* Checking the yml available in /infrastructure/api/swagger.yml
* Running the application and navigating to - http://localhost:8000/api-docs/

### How to - Build/Use the application

* build - npm install
* run - npm run dev
* test
  * you can use swagger - http://localhost:8000/api-docs/
  * you can use the provided postman collections in /test/postman/*
    * there you will find two collections
      * CARTO_MIG_TEST_EXAMPLE_COLLECTION.postman_collection - Sample collection ready to use
      * CARTO_MIG_TEST_FUNCTIONAL_TESTS.postman_collection - Collection with some functional tests, ready to run

### Testing
This application has some Unit test defined with Jest. Only as an example ( I did not have enough time to create more, sorry)
* you can run them executing npm test

This application was also tested using some postman runners. Please check the collection provided. It is available inside /test/postman.

### Possible applications improvements
* To add dependency injection, to use the interfaces defined in the domain, instead of instantiating directly the objects using the IMPL classes from the infrastructure module
* Get big query table data endpoint - The pagination should be also applied to the "server", CARTO, because if we received a lot of data from there, this applications can face memory crashes
* To add more testing