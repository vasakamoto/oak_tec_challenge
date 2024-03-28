import * as db from "./database.js";
import pug from "pug";
import { v4 as uuid } from "uuid";
import Product from "../models/products.js";
 
async function getAllProducts(req, res) {
    const products = await db.selectEverything("products");
    products.forEach((product) => {
        if(product.product_dp) {
            product.product_dp = "Disponível";
        }
        else {
            product.product_dp = "Indisponível";
        }
    });
    products.sort((a, b) => {
        if (a.product_nm < b.product_nm) {
            return -1;
        }
        if (a.product_nm > b.product_nm) {
            return 1;
        }
        return 0;
    });
    const template = pug.compileFile("./src/views/templates/product-list.pug");
    const markup = template({products}); 
    res.send(markup);
}

async function getProductByID(req, res) {
    const id = `"${req.params.id}"`;
    if(id == `"new"`) {
        const template = pug.compileFile("./src/views/templates/product-modal-post.pug");
        const markup = template({});
        res.send(markup);
    }
    else {
        const product = await db.selectByID("products", "product_id", id);
        const template = pug.compileFile("./src/views/templates/product-modal-put.pug");
        const markup = template({product});
        res.send(markup);
    }
}

async function postProduct(req, res) {
    const { product_nm, product_ds, product_vl, product_dp } = req.body;
    const product_id = "p" + uuid();
    const product_dispo = (product_dp == 1) ? 1 : 0;
    const product_dispo_show = (product_dp == 1) ? "Disponível" : "Indisponível";
    const values = `"${product_id}", "${product_nm}", "${product_ds}", ${product_vl}, ${product_dispo}`;
    const product = new Product(product_id, product_nm, product_ds, product_vl, product_dispo_show);
    await db.insertData("products", values);
    const template = pug.compileFile("./src/views/templates/product-element.pug");
    const markup = template({product});
    res.send(markup);
}

async function putProduct(req, res) {
    const product_id = `"${req.params.id}"`;
    const { product_nm, product_ds, product_vl, product_dp } = req.body;
    const values =  `product_nm = "${product_nm}", product_ds = "${product_ds}", product_vl = ${product_vl}, product_dp = ${product_dp}`;
    const where =  `product_id = ${product_id}`;
    await db.updateData("products", values, where);
    const product = await db.selectByID("products", "product_id", product_id);
    product.product_dp = (product.product_dp == 1) ? "Disponível" : "Indisponível";
    const template = pug.compileFile("./src/views/templates/product-element.pug");
    const markup = template({product});
    res.send(markup);
}

async function deleteProduct(req, res) {
    const product_id = `"${req.params.id}"`;
    const where =  `product_id = ${product_id}`;
    await db.deleteData("products", where);
    res.send("ok");
}

export { getAllProducts, getProductByID, postProduct, putProduct, deleteProduct }
