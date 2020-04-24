
# Mock rating system Overview
A node express service with 2 endpoints:
- /appService/installedApps
- /appService/relevantApplication

the ORM used to save the data from the APIs is redis
it is however designed for different database enhancements

The data structure for storing which ages installed which apps
is an array of age indexes , where the value of every index is the actual count of the times that age installed the app.

e.g.
```
 {
    "name": "facebook",
    "category": "social",
    "averageAge": "5",
    "agesInstalled": [0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
```
on the example above we can see that 20 customers by the age of 5 (the index) have installed facebook and the average age is 5.


The customer types are structured in a js file per type, in the ranking/customer_types dir
on server start , all prototypes in that dir are loaded into a customerTypes object
making it very easy to add extra featured customer types.

The data is also stored in memory as well as in redis for faster responses and to cut down the read requests from redis


# Adding a new customer type
Must implement getApps(res,age)
this module will implicitly load that type and will be available @ the /appService/relevantApplication endpoint


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

- initializes the redis cache with the structured data, stored in lib/init_data
- on any api request (e.g. Once a client sends an installedApp request), update redis and the in-memory cache to respond faster to the api request and to eliminate n (requests) redis reads.
- serves all existing endpoints.
