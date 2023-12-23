import { Product } from "../Product/Product.js";
import { promises as fs } from "node:fs";

export class ProductManagerFileBased {
  constructor(path) {
    this.path = path;
  }

  assertSatisfiesAllRequiredParameters = ({
    title,
    description,
    price,
    code,
    stock,
    category,
  }) => {
    if (!title || !description || !price || !code || !stock || !category)
      throw new Error("Faltan parámetros");
  };

  async assertCodeIsNotAlreadyStored(aCodeId) {
    try {
      const sameCodeId = (product) => product.code === aCodeId;
      const products = await this.getProducts();
      if (products.some(sameCodeId))
        throw new Error(`Ya existe un producto con el código ${aCodeId}`);
    } catch (error) {
      throw error;
    }
  }

  async nextSequentialNumber() {
    try {
      const currentLenght = (await this.getProducts()).length;
      return currentLenght + 1;
    } catch (error) {
      console.error(error.message);
    }
  }

  async initializeProductUsing({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const id = await this.nextSequentialNumber();
      return new Product({
        id,
        title,
        description,
        price,
        code,
        stock,
        status: true,
        category,
        thumbnails,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addProduct(aPotentialProduct) {
    try {
      this.assertSatisfiesAllRequiredParameters(aPotentialProduct);
      await this.assertCodeIsNotAlreadyStored(aPotentialProduct.code);

      const product = await this.initializeProductUsing(aPotentialProduct);

      const products = await this.getProducts();

      products.push(product);

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.readFileProducts();
    } catch (error) {
      console.error(error.message);
    }
  }

  async readFileProducts() {
    try {
      const potentialProductsData = await fs.readFile(this.path, "utf-8");

      const potentialProductsJs = await JSON.parse(potentialProductsData);

      const parsedProducts = potentialProductsJs.map(
        (potentialProduct) => new Product(potentialProduct)
      );

      return parsedProducts;
    } catch (error) {
      return [];
    }
  }

  async assertHasProducts() {
    try {
      const products = await this.getProducts();
      if (!products.length) throw new Error("No hay productos");
    } catch (error) {
      throw error;
    }
  }

  getProductFilteredBy(aCriteria, aProductCollection) {
    return aProductCollection.find(aCriteria);
  }

  getProductsFilteredBy(aCriteria, aProductCollection) {
    return aProductCollection.filter(aCriteria);
  }

  async getProductById(anId) {
    try {
      await this.assertHasProducts();
      const products = await this.getProducts();

      const filterCriteria = (product) => product.id === anId;

      const product = this.getProductFilteredBy(filterCriteria, products);
      if (!product)
        throw new Error(`No se encuentra el producto con ID ${anId}`);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(anId) {
    try {
      let currentProducts = await this.getProducts();

      const filterCriteria = (product) => product.id !== anId;

      currentProducts = this.getProductsFilteredBy(
        filterCriteria,
        currentProducts
      );

      await fs.writeFile(this.path, JSON.stringify(currentProducts), "utf-8");
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProduct(anOriginalProductId, anUpdatedProduct) {
    try {
      const products = await this.getProducts();

      const filterCriteria = (product) => product.id === anOriginalProductId;

      const productToUpdate = this.getProductFilteredBy(
        filterCriteria,
        products
      );

      anUpdatedProduct.id = anOriginalProductId;

      const index = products.indexOf(productToUpdate);

      if (~index) {
        products[index] = anUpdatedProduct;
      }

      await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
    } catch (error) {
      console.error(error.message);
    }
  }
}