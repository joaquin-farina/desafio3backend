const fs = require('node:fs')

class ProductsManager {
    constructor(filePath = 'productos.json') {
        this.products = [];
        this.path = filePath;
        this.loadFromFile('productos.json');
    }

    
    getProducts() {
        return this.products;
    }

    
    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock)
            return `Todos los campos del artículo con nombre "${product.title}" deben contener datos`

        const newProduct = this.products.find(prod => prod.code === product.code);
        if (newProduct) {
            console.log(`El código del artículo con nombre "${product.title}" no puede estar repetido`);
            return "No es posible cargar más de un producto con el mismo código"
        }

        product.id = this.products.length + 1
        this.products.push(product);
        console.log(`Se agregó el artículo con nombre "${product.title}" al arreglo`)

        this.saveToFile()

        return `${product.title} agregado`

    }

    getProductById(pid) {
        const otroProducto = this.products.find(prod => prod.id === pid)
        if (!otroProducto)
            return `El articulo seleccionado con ID "${pid}" no existe`

        return otroProducto
    }

    updateProduct(pid, updatedFields) {
        const productIndex = this.products.findIndex(prod => prod.id === pid);
        if (productIndex === -1) {
            throw new Error(`El artículo con ID "${pid}" no existe`);
        }

      
        if (!Object.keys(updatedFields).length) {
            throw new Error(`Debe proporcionar al menos un campo para actualizar`);
        }

        
        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };

        this.saveToFile()

        return `El artículo con ID "${pid}" ha sido actualizado`;
    }

    deleteProduct(pid) {
        const eliminarProducto = this.products.filter(prod => prod.id !== pid)
        if (eliminarProducto) {
            console.log(`Se eliminó el artículo con ID "${pid}" del arreglo`)
            this.products = eliminarProducto
            this.saveToFile()
            return this.products
        }
    }

    saveToFile() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf8');
        console.log('Datos guardados en el archivo:', this.path);
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log('Datos cargados desde el archivo:', this.path);
        } catch (error) {
            console.error('Error al cargar datos desde el archivo:', `El archivo "${this.path}" no está bien definido o no existe`);
          
            this.products = [];
        }
    }

}


const productos = new ProductsManager();

console.log(productos.getProducts());

const producto1 = { title: "producto 1", description: "Este es el primer producto", price: 5000, thumbnail: "Sin imagen", code: "abc123", stock: 75 }
const producto2 = { title: "producto 2", description: "Este es el segundo producto", price: 3500, thumbnail: "Sin imagen", code: "abc1234", stock: 75 }
const producto3 = { title: "producto 3", description: "Este es el tercer producto", price: 2000, thumbnail: "Sin imagen", code: "abc12345", stock: 75 }
const producto4 = { title: "producto 4", description: "Este es el cuarto producto", price: 6000, thumbnail: "Sin imagen", code: "abc123456", stock: 75 }
const producto5 = { title: "producto 5", description: "Este es el quinto producto", price: 3500, thumbnail: "Sin imagen", code: "abc1234567", stock: 75 }
const producto6 = { title: "producto 6", description: "Este es el sexto producto", price: 2000, thumbnail: "Sin imagen", code: "abc12345678", stock: 75 }
const producto7 = { title: "producto 7", description: "Este es el séptimo producto", price: 3700, thumbnail: "Sin imagen", code: "abc123456789", stock: 75 }
const producto8 = { title: "producto 8", description: "Este es el octavo producto", price: 7000, thumbnail: "Sin imagen", code: "abc234", stock: 75 }
const producto9 = { title: "producto 9", description: "Este es el noveno producto", price: 5200, thumbnail: "Sin imagen", code: "abc2345", stock: 75 }
const producto10 = { title: "producto 10", description: "Este es el décimo producto", price: 8200, thumbnail: "Sin imagen", code: "abc23456", stock: 75 }


console.log(productos.addProduct(producto1));
console.log(productos.addProduct(producto2));
console.log(productos.addProduct(producto3));
console.log(productos.addProduct(producto4));
console.log(productos.addProduct(producto5));
console.log(productos.addProduct(producto6));
console.log(productos.addProduct(producto7));
console.log(productos.addProduct(producto8));
console.log(productos.addProduct(producto9));
console.log(productos.addProduct(producto10));

module.exports = productos