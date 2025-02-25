const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const { validateAndDecodeToken } = require("./middleware/authMiddleware");

const { getConfig } = require("./config");
const { init: connectDb } = require('./mongodb');
const { logger } = require("./utils/logger/logger");
const config = getConfig();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: validateAndDecodeToken
});

const port = config.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  connectDb(config.database);
  logger.log(`🚀 Server ready at ${url}`);
});
