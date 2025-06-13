import {gql} from "apollo-server-express";
const typeDefs = gql`
  type User {
    id: ID!
    correo: String!
  }

  type Query {
    getUsers: [User]
    login(correo: String!, password: String!): String
  }

  type Mutation {
    createUser(correo: String!, password: String!): User
    updateUser(id: ID!, correo: String, password: String): User
    deleteUser(id: ID!): Boolean
  }
`;

export default typeDefs;
