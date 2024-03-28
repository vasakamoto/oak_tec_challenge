import express from "express";
import { router } from "./src/controllers/routes.js";

const localHost = 3000;

const server = express();

function app(localHost) {
    server.listen(localHost);
    console.log(`Server is listening at port http://localhost:${localHost}`);
}

server.set("views", "./src/views");
server.set("view engine", "pug");

server.use(express.urlencoded({extended:true}))
server.use(router);
server.use(express.static("./"));

app(localHost);
