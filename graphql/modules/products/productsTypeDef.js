const { gql } = require("apollo-server-express");

const productsTypeDefs = gql `

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type Query {
    getTopSellingProducts(limit: Int!, pageNumber: Int): [TopProduct]
  }
`

module.exports = productsTypeDefs;