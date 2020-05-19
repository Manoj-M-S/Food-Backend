const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const port = process.env.PORT || 5000;

app.use(cors());

require("dotenv").config();

const recipeRoutes = require("./api/routes/recipes");
const userRoutes = require("./api/routes/users");

//CONNECTING MONGODB ;
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;

//LOG
app.use(morgan("dev"));

//PARSING THE DATA
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const server = http.createServer(app);
server.listen(port);
console.log(`App is up and running at ${port}`);
