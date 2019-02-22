const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const projectsRoute = require("./routes/projectsRoute");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/projects/", projectsRoute);

server.get("/", async (req, res, next) => {
  res.send(`
    <h2>Lambda - Sprint Challenge RDBMS</h2>
  `);
});

module.exports = server;
