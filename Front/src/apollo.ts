import {ApolloClient, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Cambia al puerto de tu backend si es diferente
  cache: new InMemoryCache(),
});

export default client;
