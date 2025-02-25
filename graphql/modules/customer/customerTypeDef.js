const { gql } = require("apollo-server-express");

const customerTypeDefs = gql `

  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
  }

  type OrderedProduct {
    name: String!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type Orders {
    _id: ID!
    totalAmount: Float!
    orderDate: String!
    status: String!
    products: [OrderedProduct!]!
  }

  type CustomerOrders {
    orders: [Orders]!
  }
  

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getCustomerOrders(customerId: ID!, limit: Int!, pageNumber: Int): CustomerOrders
  }
`

module.exports = customerTypeDefs;