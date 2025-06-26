import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prismaClient } from '..';
import { UnprocessableEntity } from '../exceptions/validation';
import { ErrorCodes } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found-exception';

// In-memory product storage
let products: any[] = [
    { id: uuidv4(), name: "Apple", description: "Fresh red apple", price: 1.99 },
    { id: uuidv4(), name: "Orange", description: "Sweet orange", price: 2.49 },
    { id: uuidv4(), name: "Orange", description: "Sweet orange", price: 2.49 },
    { id: uuidv4(), name: "Orange", description: "Sweet orange", price: 2.49 },
    { id: uuidv4(), name: "Orange", description: "Sweet orange", price: 2.49 },
];

// Get all products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await prismaClient.product.findMany();
        res.json(products);
    } catch (e: any) {
        next(e);
    }
};

// Get a single product
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const productId = parseInt(req.params.id);

        const product = await prismaClient.product.findUnique({
            where: {
                id: productId
            }
        });

        if (!product) {
            return next(new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND));
        }

        res.json(product);
    } catch (e: any) {
        next(e);
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, description, price, tags } = req.body;

        let product = await prismaClient.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                tags: tags
            }
        })

        res.json({
            status: true,
            message: "Product created success!",
            data: product
        })
    } catch (e: any) {
        return next(new UnprocessableEntity(e?.issues || e.message, 'Unprocessable', ErrorCodes.UNPROCESSABLE_ENTITY));
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, description, price, tags } = req.body;

        const existingProduct = await prismaClient.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return next(new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND));
        }

        const updatedProduct = await prismaClient.product.update({
            where: { id: productId },
            data: { name, description, price, tags }
        });

        res.json({
            status: true,
            message: "Product updated successfully!",
            data: updatedProduct
        });
    } catch (e: any) {
        next(e);
    }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = parseInt(req.params.id);

        const existingProduct = await prismaClient.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return next(new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND));
        }

        await prismaClient.product.delete({
            where: { id: productId }
        });

        res.json({
            status: true,
            message: "Product deleted successfully!"
        });
    } catch (e: any) {
        next(e);
    }
};

