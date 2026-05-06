import type {Product} from './server.ts';

export const products: Product[] = [
    {
        id: crypto.randomUUID(),
        name: "Producto 1",
        price: 10,
        stock: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: crypto.randomUUID(),
        name: "Producto 2",
        price: 20,
        stock: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
];
