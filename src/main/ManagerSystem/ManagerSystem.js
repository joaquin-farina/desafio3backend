import { CartManagerFileBased } from "../CartManager/CartManagerFileBased.js";
import { ProductManagerFileBased } from "../ProductManager/ProductManagerFileBased.js";

const CARTS_PATH = "./resources/Carts.json";
const cartManager = new CartManagerFileBased(CARTS_PATH);

const PRODUCTS_PATH = "./resources/Products.json";
const productManager = new ProductManagerFileBased(PRODUCTS_PATH);

export { cartManager, productManager };