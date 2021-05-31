const express = require("express");
const server = express();
require("dotenv").config();
const db = require("./models");
const routes = require("./routes");
const cors = require("cors");
const fileUpload = require("express-fileupload");

server.use(
    fileUpload({
        createParentPath: true,
    })
);
server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(process.env.PORT);
