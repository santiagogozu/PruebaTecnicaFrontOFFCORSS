import {gql} from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String
    $name: String
    $lastName: String
    $email: String
    $userType: String
    $password: String
  ) {
    updateUser(
      id: $id
      username: $username
      name: $name
      lastName: $lastName
      email: $email
      userType: $userType
      password: $password
    ) {
      id
      username
      createDate
      name
      lastName
      email
      userType
    }
  }
`;
