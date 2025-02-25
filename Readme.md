Features:
    getCustomerSpending by customerId
    getTopSellingProducts by limit and pageNumber, (pagination support default pageNumber 1)
    getSalesAnalytics(startDate, endDate) get stats analytics in given time range
    getCustomerOrders(customerId, limit, pageNumber) get all orders by customerId with pagination (default pageNumber 1) 
    createOrder([products])  create new order and reduce stock for ordered product items 

install dependencies by ` npm i`

copy config/example.config.json and make config/development.config.json
values of development.config.json:
{
  "PORT": 4000,
  "database": {
      "username": "robingarg6626",
      "password": "2lnj0PP0Tz5cpySd",
      "databaseName": "atoz"
  },
  "redisConnection": {
      "port": 6379,
      "hostname": "localhost"
  },
  "jwt": {
      "secret": "iiuuyytre"
  }
}

run command to run the server  `npm run start`



