import { Request, Response, NextFunction } from 'express';
import { changeQuantitySchema, CreateCartSchema } from '../schema/cart';
import { Product } from '../../generated/prisma';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found-exception';
import { ErrorCodes } from '../exceptions/root';

// Add item to cart
export const addItemToCart = async (req: Request, res: Response, _next: NextFunction) => {

    const validateData = CreateCartSchema.parse(req.body);

    let product: Product;

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validateData.productId
            }
        });
    } catch (err) {
        throw new NotFoundException('Product Not found', ErrorCodes.PRODUCT_NOT_FOUND);
    }

    const cart = await prismaClient.cartItem.create({
        data : {
            userId : req.user.id,
            productId : validateData.productId, // ✅ fixed here
            quantity : validateData.quantity
        }
    });

    res.json({
        message : "Add to cart success!",
        data : cart
    });
};


// Delete cart item
export const deleteItemFromCart = async(req: Request, res: Response, _next: NextFunction) => {
    await prismaClient.cartItem.delete({
       where : {
         id : +req.params.id 
       }
    });

    res.json({
        message : "Delete cart item success!",
        status : true
    })
};

// List all cart items
export const changeQuantity =async (req: Request, res: Response, _next: NextFunction) => {

    const validateData = changeQuantitySchema.parse(req.body);

    const updateCart = await prismaClient.cartItem.update({
        where : {
            id : +req.params.id
        },
        data : {
            quantity : validateData.quantity
        }
    });
    // --- Response: Array of dummy items ---
    res.json({
        message : "Cart update success!",
        data : updateCart
    });

};

// Get single cart item by ID
export const getCart = async (req: Request, res: Response, _next: NextFunction) => {
    const cartItemId = +req.params.id;
    console.log("[getCart] Start - Fetching cart item with ID:", cartItemId);

    try {
        console.log("[getCart] Parsing cartItemId:", cartItemId);

        const cartItem = await prismaClient.cartItem.findUnique({
            where: {
                id: cartItemId
            },
            include: {
                product: true // include product details
            }
        });

        console.log("[getCart] Prisma query executed");

        if (!cartItem) {
            console.warn("[getCart] No cart item found with ID:", cartItemId);
            throw new NotFoundException('Cart item not found', ErrorCodes.PRODUCT_NOT_FOUND);
        }

        console.log("[getCart] Cart item found:", cartItem);

        res.json({
            message: "Cart item fetched successfully!",
            data: cartItem
        });
    } catch (err) {
        console.error("[getCart] Error occurred:", err);

        res.status(500).json({
            message: "Failed to fetch cart item",
            error: err
        });
    }
};

