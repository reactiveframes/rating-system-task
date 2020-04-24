
# Mock rating system Overview
A node express service with 2 endpoints:
- /appService/installedApps
- /appService/relevantApplication

the ORM used to save the data from the APIs is redis
it is however designed for enhancing different databases.

The data structure for storing which ages installed which apps
is an array of age indexes , where the value of every index is the actual count of the times that age installed the app.

The customer types are structured in a js file per type, in the ranking/customer_types dir
on server start , all prototypes in that dir are loaded into a customerTypes object
making it very easy to add extra featured customer types.

The data is also stored in memory as well as in redis for faster responses and to cut down the read requests from redis




# Run
make sure the following components are installed on your OS
- docker
- docker-compose
- node


from this relative path, you can either run from terminal 
- ./start-server.sh

<br>

or from terminal
- docker-compose up -d
- npm i
- npm run start
 
- npm run test (to view the full test coverage)
    - unit tests
    - api tests
    - integration test

# Server lifecycle

- initialize the redis cache with the structured data, stored in lib/init_data
- on any api request (e.g. Once a client sends a installedApp request), update redis and the in-memory cache to respond faster to the api request and to eliminate n (requests) redis reads.
- serves all existing endpoints.
