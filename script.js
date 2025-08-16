// app.js

const API_URL = 'https://api.escuelajs.co/api/v1/products';
const contenedorProductos = document.getElementById('lista-productos');
const contenedorCarrito = document.getElementById('lista-carrito');
const totalCarritoSpan = document.getElementById('total-carrito');
const mensajeCarritoVacio = document.getElementById('carrito-vacio-mensaje');

let carrito = [];

class Producto {
    constructor(id, nombre, precio, categoria, descripcion, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }

    // Usando template literals y desestructuración en un método de clase
    mostrarInfo() {
        const { nombre, precio, categoria } = this;
        return `
            Nombre: ${nombre}
            Precio: $${precio}
            Categoría: ${categoria}
        `;
    }
}

// Función asincrónica para obtener los productos de la API
const obtenerProductos = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }
        const productosData = await respuesta.json();
        // Filtrar productos que tienen un nombre y precio válidos y limitar a 20 para evitar sobrecarga
        const productosValidos = productosData
            .filter(p => p.title && p.price)
            .slice(0, 20);
        
        const productosInstancias = productosValidos.map(p => {
            return new Producto(p.id, p.title, p.price, p.category.name, p.description, p.images[0]);
        });
        
        mostrarProductos(productosInstancias);

    } catch (error) {
        console.error("Error al obtener los productos:", error);
        contenedorProductos.innerHTML = `<p class="mensaje-error">Hubo un error al cargar los productos. Inténtalo de nuevo más tarde.</p>`;
    }
};

// Función para mostrar los productos en el DOM
const mostrarProductos = (productos) => {
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de mostrar
    productos.forEach(producto => {
        const tarjetaProducto = document.createElement('div');
        tarjetaProducto.classList.add('tarjeta-producto');
        
        // Usando desestructuración para un acceso rápido
        const { id, nombre, precio, imagen } = producto;

        tarjetaProducto.innerHTML = `
            <img src="${imagen}" alt="${nombre}">
            <h3>${nombre}</h3>
            <p class="precio">$${precio}</p>
            <button class="boton-agregar" data-id="${id}">Agregar al Carrito</button>
        `;
        
        // Uso de funciones de flecha para el evento del botón
        const botonAgregar = tarjetaProducto.querySelector('.boton-agregar');
        botonAgregar.addEventListener('click', () => agregarAlCarrito(producto));

        contenedorProductos.appendChild(tarjetaProducto);
    });
};

// Función para agregar un producto al carrito
const agregarAlCarrito = (producto) => {
    carrito.push(producto);
    actualizarCarrito();
};

// Función para actualizar la vista del carrito
const actualizarCarrito = () => {
    if (carrito.length > 0) {
        mensajeCarritoVacio.style.display = 'none';
    } else {
        mensajeCarritoVacio.style.display = 'block';
    }

    contenedorCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const itemCarrito = document.createElement('div');
        itemCarrito.classList.add('tarjeta-item-carrito');
        itemCarrito.innerHTML = `
            <p>${producto.nombre}</p>
            <p>$${producto.precio}</p>
        `;
        contenedorCarrito.appendChild(itemCarrito);
        total += producto.precio;
    });

    totalCarritoSpan.textContent = total.toFixed(2);
};

// Iniciar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);