const { gql } = require("apollo-server-express");

const orderTypeDefs = gql `
  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue]!
  }

  type Query {
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
  }

  input OrderedProductInput {
    productId: String!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type Mutation {
    createOrder(products: [OrderedProductInput!]!): Boolean!
  }
`

module.exports = orderTypeDefs;