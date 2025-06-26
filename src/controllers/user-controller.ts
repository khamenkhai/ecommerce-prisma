import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { UnprocessableEntity } from '../exceptions/validation';
import { ErrorCodes } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found-exception';
import { AddressSchema } from '../schema/user';
import { User } from '../../generated/prisma';

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Convert string userId to number if needed
        if (typeof req.body.userId === 'string') {
            req.body.userId = parseInt(req.body.userId);
        }

        // Validate request body
        const validatedData = AddressSchema.parse({
            ...req.body,
            lineTwo: req.body.lineTwo || null // Ensure optional field is properly handled
        });

        // Verify user exists
        const user = await prismaClient.user.findFirstOrThrow({
            where: { id: validatedData.userId }
        });

        // Create address (only connect via userId)
        const address = await prismaClient.address.create({
            data: {
                lineOne: validatedData.lineOne,
                lineTwo: validatedData.lineTwo,
                city: validatedData.city,
                country: validatedData.country,
                pinCode: validatedData.pinCode,
                userId: user.id // Only set userId, not user object
            }
        });

        res.status(201).json(address);
    } catch (error: any) {
        if (error.code === 'P2025') {
            // Prisma not found error
            res.status(404).json({ error: "User not found" });
        } else {
            // Generic error
            console.error("Address creation error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

// Delete an address
export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addressId = parseInt(req.params.id);

        // Check if address exists
        await prismaClient.address.findFirstOrThrow({
            where: { id: addressId }
        });

        await prismaClient.address.delete({
            where: { id: addressId }
        });

        res.json({ success: true });
    } catch (error: any) {
        if (error.code === 'P2025') {
            next(new NotFoundException("Address not found!", ErrorCodes.ADDRESS_NOT_FOUND));
        } else {
            next(error);
        }
    }
};

// List all addresses for a user
export const listAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIdStr = req.body.userId;
        const userId = parseInt(userIdStr, 10);

        if (isNaN(userId)) {
            return next(new UnprocessableEntity("Invalid Userid", "Invalid userId", ErrorCodes.UNPROCESSABLE_ENTITY));
        }

        await prismaClient.user.findFirstOrThrow({ where: { id: userId } });

        const addresses = await prismaClient.address.findMany({ where: { userId } });

        res.json(addresses);
    } catch (error: any) {
        if (error.code === 'P2025') {
            next(new NotFoundException("User not found!", ErrorCodes.USER_NOT_FOUND));
        } else {
            next(error);
        }
    }
};


// Get a single address
export const getAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await prismaClient.address.findFirstOrThrow({
            where: { id: parseInt(req.params.id) }
        });

        res.json(address);
    } catch (error: any) {
        if (error.code === 'P2025') {
            next(new NotFoundException("Address not found!", ErrorCodes.ADDRESS_NOT_FOUND));
        } else {
            next(error);
        }
    }
};