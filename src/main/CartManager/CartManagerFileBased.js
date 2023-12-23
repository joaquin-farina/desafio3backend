import { Cart } from "../Cart/Cart.js";
import { promises as fs } from "node:fs";
import { productManager } from "../ManagerSystem/ManagerSystem.js";

export class CartManagerFileBased {
  constructor(path) {
    this.path = path;
  }

  async nextSequentialNumber() {
    try {
      const currentLenght = (await this.getCarts()).length;
      return currentLenght + 1;
    } catch (error) {
      console.error(error.message);
    }
  }

  async initializeCartUsing(products) {
    try {
      const id = await this.nextSequentialNumber();
      return new Cart({
        id,
        products,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addCart() {
    try {
      const cart = await this.initializeCartUsing([]);

      const carts = await this.getCarts();

      carts.push(cart);

      await fs.writeFile(this.path, JSON.stringify(carts), "utf-8");
    } catch (error) {
      throw error;
    }
  }

  async getProductsFrom(aCartID) {
    try {
      const cart = await this.getCartById(aCartID);
      
      return cart.products;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getCarts() {
    try {
      return await this.readFileCarts();
    } catch (error) {
      console.error(error.message);
    }
  }

  async readFileCarts() {
    try {
      const potentialCartsData = await fs.readFile(this.path, "utf-8");

      const potentialCartsJs = await JSON.parse(potentialCartsData);

      const parsedCarts = potentialCartsJs.map(
        (potentialCart) => new Cart(potentialCart)
      );

      return parsedCarts;
    } catch (error) {
      return [];
    }
  }

  async assertHasCarts() {
    try {
      const carts = await this.getCarts();
      if (!carts.length) throw new Error("No hay carritos");
    } catch (error) {
      throw error;
    }
  }

  getObjectFilteredBy(aCriteria, anObjectCollection) {
    return anObjectCollection.find(aCriteria);
  }

  getProductFilteredBy(aCriteria, aProductCollection) {
    return this.getObjectFilteredBy(aCriteria, aProductCollection);
  }

  getCartFilteredBy(aCriteria, aCartCollection) {
    return this.getObjectFilteredBy(aCriteria, aCartCollection);
  }

  getCartsFilteredBy(aCriteria, aCartCollection) {
    return aCartCollection.filter(aCriteria);
  }

  async getCartById(anId) {
    try {
      await this.assertHasCarts();
      const carts = await this.getCarts();

      const filterCriteria = (cart) => cart.id === anId;

      const cart = this.getCartFilteredBy(filterCriteria, carts);
      if (!cart) throw new Error(`No se encuentra el carrito con ID ${anId}`);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  assertSatisfiesAllProductRequiredParameters = (productID) => {
    if (!productID) throw new Error("Faltan parámetros");
  };

  async hasProductAlreadyBeenAdded(aProductID, aCartID) {
    try {
      const sameProductID = (product) => product.productID === aProductID;
      const products = await this.getProductsFrom(aCartID);
      return products.some(sameProductID);
    } catch (error) {
      throw error;
    }
  }

  async assertProductIDIsValid(aProductID) {
    try {
      await productManager.getProductById(aProductID);
    } catch (error) {
      throw error;
    }
  }

  async addProduct(aProductID, aCartID) {
    try {
      this.assertSatisfiesAllProductRequiredParameters(aProductID);
      await this.assertProductIDIsValid(aProductID);
      let products = await this.getProductsFrom(aCartID);
      let carts = await this.getCarts();
      const cartFilterCriteria = (cart) => cart.id === aCartID;
      const productFilterCriteria = (product) =>
        product.productID === aProductID;
      let cartToUpdate = this.getCartFilteredBy(cartFilterCriteria, carts);

      if (await this.hasProductAlreadyBeenAdded(aProductID, aCartID)) {
        let productToUpdate = this.getProductFilteredBy(
          productFilterCriteria,
          products
        );
        const index = products.indexOf(productToUpdate);
        productToUpdate.quantity++;

        if (~index) {
          products[index] = productToUpdate;
        }
      } else {
        products.push({ productID: aProductID, quantity: 1 });
      }

      const cartIndex = carts.indexOf(cartToUpdate);

      cartToUpdate.products = products;

      if (~cartIndex) {
        carts[cartIndex] = cartToUpdate;
      }

      await fs.writeFile(this.path, JSON.stringify(carts), "utf-8");
    } catch (error) {
      throw error;
    }
  }
}