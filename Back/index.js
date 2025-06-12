// import express from "express";
// import db from "./config/database.js";
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// // Ruta base
// app.get("/", (req, res) => {
//   res.send("¡Hola, Express!");
// });

// db.authenticate()
//   .then(() => {
//     console.log("Conexión exitosa a la DB");
//     app.listen(8080, () => {
//       console.log("Server UP and running");
//     });
//   })
//   .catch((error) => {
//     console.error("Conexión error DB:", error);
//   });

// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en http://localhost:${PORT}`);
// });

import express from "express";
import db from "./config/database.js";
import cors from "cors";

// import employeesRoutes from "./routes/employeesRoutes.js";
// import requestsRoutes from "./routes/requestsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

let allowedHosts = [];
if (process.env.ALLOWED_HOSTS) {
  allowedHosts = JSON.parse(process.env.ALLOWED_HOSTS);
}

app.use(cors({origin: "*", credentials: true}));
app.use(express.json());

// app.use("/empleados", employeesRoutes);
// app.use("/solicitudes", requestsRoutes);
app.use("/usuario", userRoutes);

db.authenticate()
  .then(() => {
    console.log("Conexión exitosa a la DB");
    app.listen(8080, () => {
      console.log("Server UP and running");
    });
  })
  .catch((error) => {
    console.error("Conexión error DB:", error);
  });
