import {gql} from "apollo-server-express";
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createDate: String!
    name: String!
    lastName: String!
    email: String!
    userType: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User]
    login(username: String!, password: String!): AuthPayload
  }

  type Mutation {
    createUser(
      username: String!
      name: String!
      lastName: String!
      email: String!
      userType: String!
      password: String!
    ): User
    updateUser(
      id: ID!
      username: String
      name: String
      lastName: String
      email: String
      userType: String
      password: String
    ): User
    deleteUser(id: ID!): Boolean
  }
`;

export default typeDefs;
