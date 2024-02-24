import express from "express";
import bodyParser from "body-parser";

import userRoutes from "./routes/users.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(5000, () =>
  console.log("Server Running on site: http://localhost:" + PORT)
);
