const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    favouriteCount: Int!
    favouritedBy: [User!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favourites: [Note!]!
  }
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    noteFeed(cursor: String): NoteFeed
    user(username: String!): User
    users: [User!]!
    me: User!
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!

    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!

    toggleFavourite(id: ID!): Note!
  }
`;
