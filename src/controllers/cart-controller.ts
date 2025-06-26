import { Request, Response, NextFunction } from 'express';

// Add item to cart
export const addItemToCart = (_req: Request, res: Response, _next: NextFunction) => {
    // --- Response: Dummy Cart Item ---
    res.status(201).json({
        id: 1,
        productId: 101,
        quantity: 2,
        createdAt: "2025-06-26T10:00:00.000Z",
        updatedAt: "2025-06-26T10:00:00.000Z"
    });
};

// Delete cart item
export const deleteItemFromCart = (_req: Request, res: Response, _next: NextFunction) => {
    // --- Response: Deletion success ---
    res.json({ success: true });
};

// List all cart items
export const changeQuantity = (_req: Request, res: Response, _next: NextFunction) => {
    // --- Response: Array of dummy items ---
    res.json([
        {
            id: 1,
            productId: 101,
            quantity: 2,
            createdAt: "2025-06-26T10:00:00.000Z",
            updatedAt: "2025-06-26T10:00:00.000Z"
        },
        {
            id: 2,
            productId: 102,
            quantity: 1,
            createdAt: "2025-06-26T11:00:00.000Z",
            updatedAt: "2025-06-26T11:00:00.000Z"
        }
    ]);
};

// Get single cart item
export const getCart = (_req: Request, res: Response, _next: NextFunction) => {
    // --- Response: One dummy cart item ---
    res.json({
        id: 1,
        productId: 101,
        quantity: 2,
        createdAt: "2025-06-26T10:00:00.000Z",
        updatedAt: "2025-06-26T10:00:00.000Z"
    });
};
