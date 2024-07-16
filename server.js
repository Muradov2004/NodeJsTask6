require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes.js");

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const app = express();
const port = 5000;

app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
