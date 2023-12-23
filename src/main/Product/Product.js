export class Product {
    constructor({
      id, 
      title,
      description,
      price,
      code,
      stock,
      status,
      category,
      thumbnails,
    }) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.price = price;
      this.code = code;
      this.stock = stock;
      this.status = status;
      this.category = category;
      !thumbnails ? (this.thumbnails = []) : (this.thumbnails = thumbnails);
    }

  }