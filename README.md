
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


The customer types are structured in a js file per type (convention), in the ranking/customer_types dir, where lib/ranking/index.js loads them all (on runtime) when the server starts. 
on server start , all prototypes in that dir are available by requiring customer_types dir
making it very easy to add extra featured customer types.

The data is also stored in a global cache object named appDetails (stored as well in redis) for faster responses and to cut down the read requests from redis or any other database.


# Adding a new customer type
Must implement getApps(res,age)
the new module will be implicitly loaded at runtime and will be available @ the /appService/relevantApplication endpoint.
The new customerType js file must exist in the following path:
lib/rankings/customer_types

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

# Usage
Once server is started, you can send/test requests by either clicking on the following links or via postman for example:

- GET
    - http://127.0.0.1:3000/appService/relevantApplication?age=29&category=social&customerType=bronze
    - http://127.0.0.1:3000/appService/relevantApplication?age=30&category=social&customerType=silver
    - http://127.0.0.1:3000/appService/relevantApplication?age=35&category=social&customerType=gold
  
- POST (with no payload)
    - http://127.0.0.1:3000/appService/installedApps?installedApp=facebook&age=33


Or by running the full test coverage concurrently by:
```
npm run test
```

# Server lifecycle
- loads all existing customer types modules from /lib/ranking/customer_type implicitly from customer_types index.js
- initializes the redis cache with the structured data, stored in lib/init_data
- on any api request (e.g. Once a client sends an installedApp request), update redis and the in-memory cache to respond faster to the api request and to eliminate n (requests) redis reads.
- serves all existing endpoints.
