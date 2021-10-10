const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, `${process.env.JWT_SECRET}`);
    } catch (error) {
      throw new Error('Session invalid');
    }
  }
};

const port = process.env.PORT || 4000;
const DB_HOST = 'mongodb://localhost:27017/notedly';

const app = express();
app.use(helmet());
app.use(cors());
db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { models, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(`Server running at http://localhost:${port}${server.graphqlPath}`)
);
