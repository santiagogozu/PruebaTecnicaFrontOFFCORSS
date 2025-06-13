// import express from "express";
// import {ApolloServer} from "apollo-server-express";
// import sequelize from "./db.js";
// import userTypeDefs from "./typeDefs/userTypeDefs.js";
// import userResolvers from "./resolvers/userResolver.js";
// import dotenv from "dotenv";

// dotenv.config();

// (async () => {
//   const app = express();

//   const server = new ApolloServer({
//     typeDefs: userTypeDefs,
//     resolvers: userResolvers,
//   });

//   await server.start();
//   server.applyMiddleware({app});

//   await sequelize.sync({alter: true}); // Crea las tablas si no existen

//   const PORT = process.env.PORT || 4000;
//   app.listen(PORT, () => {
//     console.log(
//       `🚀 Servidor corriendo en http://localhost:${PORT}${server.graphqlPath}`
//     );
//   });
// })();

import express from "express";
import {ApolloServer} from "apollo-server-express";
import sequelize from "./db.js";
import userTypeDefs from "./typeDefs/userTypeDefs.js";
import userResolvers from "./resolvers/userResolver.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
dotenv.config();

(async () => {
  const app = express();

  app.use(cors());
  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  });

  await server.start();
  server.applyMiddleware({app});

  app.get("/api/products", async (req, res) => {
    try {
      const response = await fetch(
        "https://offcorss.myvtex.com/api/catalog_system/pub/products/search/"
      );

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error al obtener productos VTEX:", error);
      res.status(500).json({error: "Error al obtener productos de VTEX"});
    }
  });

  await sequelize.sync({alter: true});

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Servidor corriendo en http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `📦 Endpoint productos VTEX disponible en http://localhost:${PORT}/api/products`
    );
  });
})();
