// Importamos Express para crear la API.
import express from "express";
import cors from "cors";

// Importamos el array de productos iniciales.
// import { products as PRODUCTS } from "./product.ts";
import PRODUCTS from "./products.json" with { type: "json" };

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    is_active: boolean;
    created_at?: Date; // Campos opcionales para la fecha de creación y actualización.
    updated_at?: Date;
}

type ProductCreateDTO = Omit<Product, "id" | "created_at" | "updated_at">; // Tipo para la entrada de datos al crear o actualizar un producto.
type ProductUpdateDTO = Partial<ProductCreateDTO>; // Tipo para la entrada de datos al actualizar un producto, todos los campos son opcionales.

const products: Product[] = PRODUCTS.map((product) => ({
    ...product,
    created_at: new Date(product.created_at),
    updated_at: new Date(product.updated_at),
})); // Hacemos un cast para que TypeScript reconozca el tipo de datos.

// Creamos la aplicación de Express.
const app = express();

// Definimos el puerto donde funcionará el servidor.
const PORT = process.env.PORT || 3000;

// Habilitamos CORS para permitir peticiones desde el frontend.
app.use(cors());

// Permitimos que Express lea JSON en el body de las peticiones.
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

// GET /api/products: devuelve todos los productos.
app.get("/api/products", (req, res) => {
    res.json(products);
});

// GET /api/products/:id: devuelve un producto por su id.
app.get("/api/products/:id", (req, res) => {
    const product = products.find((item) => item.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

// POST /api/products: crea un nuevo producto.
app.post("/api/products", (req, res) => {
    const { body }: { body: ProductCreateDTO } = req;

    if (!body.name || body.price === undefined || body.stock === undefined) {
        return res.status(400).json({ message: "Missing required fields: name, price, stock" });
    }

    const newProduct: Product = {
        id: crypto.randomUUID(),
        name: body.name,
        price: body.price,
        stock: body.stock,
        is_active: body.is_active ?? true,
        created_at: new Date(),
        updated_at: new Date(),
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// PATCH /api/products/:id: actualiza un producto por su id.
app.patch("/api/products/:id", (req, res) => {
    const product = products.find((item) => item.id === req.params.id);

    const { body }: { body: ProductUpdateDTO } = req;

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.name = body.name ?? product.name; // Solo actualizamos el campo si se proporciona en el body.
    product.price = body.price ?? product.price; // El operador nullish coalescing (??) asegura que si el valor es null o undefined, se mantenga el valor actual.
    product.stock = body.stock ?? product.stock; // De esta forma, si el cliente no envía un campo, no se sobrescribirá con undefined.
    product.is_active = body.is_active ?? product.is_active; // Lo mismo para el campo is_active.
    product.updated_at = new Date(); // Actualizamos la fecha de actualización.

    res.json(product); // Devolvemos el producto actualizado.
});

// DELETE /api/products/:id: elimina un producto por su id.
app.delete("/api/products/:id", (req, res) => {
    const index = products.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    const deletedProduct = products.splice(index, 1);
    res.json(deletedProduct[0]);
});

// Iniciamos el servidor.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
