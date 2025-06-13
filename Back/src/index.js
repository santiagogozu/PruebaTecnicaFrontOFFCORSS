import express from "express";
import {ApolloServer} from "apollo-server-express";
import sequelize from "./db.js";
import userTypeDefs from "./typeDefs/userTypeDefs.js";
import userResolvers from "./resolvers/userResolver.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  });

  await server.start();
  server.applyMiddleware({app});

  await sequelize.sync({alter: true}); // Crea las tablas si no existen

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Servidor corriendo en http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
