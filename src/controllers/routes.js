import path from "node:path";
import express from "express";
import * as products from "./products.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index.pug");
});

router.get("/products", products.getAllProducts);
router.get("/products/:id", products.getProductByID);
router.post("/products", products.postProduct);
router.put("/products/:id", products.putProduct);
router.delete("/products/:id", products.deleteProduct);

export { router }
