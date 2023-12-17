const express = require('express')
const productos = require('./productManager')


const app = express()

app.get('/products', (req, res) => {
    const limiteProductos = req.query.limit

    if(limiteProductos <  productos.getProducts().length){
        const numeroDeProductos = productos.getProducts().filter(prod => prod.id <= limiteProductos);
        res.send(numeroDeProductos)
    }

    res.send(productos.getProducts())
})

app.get('/products/:pid', (req, res) => {
    const { pid } = req.params
    const product = productos.getProductById(Number(pid))
    console.log('Esta es la ruta de productos')
    res.send(product)
})

const port = 8080
app.listen(port, ()=>{
    console.log(`Escuchando en el puerto ${port}`)
})