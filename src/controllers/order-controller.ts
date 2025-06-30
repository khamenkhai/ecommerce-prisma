import { Request, Response } from "express";
import { prismaClient } from "..";


export const createOrder = async (req: Request, res: Response) => {
    try {
        await prismaClient.$transaction(async (tx) => {
            const cartItems = await tx.cartItem.findMany({
                where: {
                    userId: req.user.id
                },
                include: {
                    product: true
                }
            });

            if (cartItems.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Cart is empty!",
                    error: "No cart items found for the user."
                });
            }

            const price = cartItems.reduce((prev, current) => {
                return prev + (current.quantity * +current.product.price);
            }, 0);

            const address = await tx.address.findFirst({
                where: {
                    id: req.user.defaultShippingAddress
                }
            });

            if (!address) {
                return res.status(404).json({
                    status: false,
                    message: "Default shipping address not found.",
                    error: "User has no valid default shipping address."
                });
            }

            const order = await tx.order.create({
                data: {
                    userId: req.user.id,
                    netAmount: price,
                    address: address.formattedAddress ?? "Unknown address",
                    products: {
                        create: cartItems.map((cart) => ({
                            productId: cart.productId,
                            quantity: cart.quantity
                        }))
                    }
                }
            });

            const orderEvent = await tx.orderEvent.create({
                data: {
                    orderId: order.id
                }
            });

            await tx.cartItem.deleteMany({
                where: {
                    userId: req.user.id
                }
            });

            res.status(200).json({
                status: true,
                message: "Order placed successfully!",
                data: {
                    order,
                    orderEvent
                }
            });
        });
    } catch (err: any) {
        console.error("[createOrder] Internal error:", err);
        res.status(500).json({
            status: false,
            message: "Failed to create order.",
            error: err.message || "Unexpected error occurred."
        });
    }
};


export const listOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prismaClient.order.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                events: {
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (err: any) {
        console.error("[listOrders] Error:", err);
        res.status(500).json({
            status: false,
            message: "Failed to fetch orders",
            error: err.message || "Unexpected error"
        });
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const orderId = +req.params.id;

        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            }
        });

        if (!order) {
            res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        // Check if it's already cancelled or delivered
        const latestEvent = await prismaClient.orderEvent.findFirst({
            where: { orderId },
            orderBy: { createdAt: "desc" }
        });

        if (latestEvent?.status === "CANCELLED" || latestEvent?.status === "DELIVERED") {
            res.status(400).json({
                status: false,
                message: `Cannot cancel order. Current status is '${latestEvent.status}'.`
            });
        }

        const cancelledEvent = await prismaClient.orderEvent.create({
            data: {
                orderId,
                status: "CANCELLED"
            }
        });

        res.status(200).json({
            status: true,
            message: "Order cancelled successfully",
            data: cancelledEvent
        });
    } catch (err: any) {
        console.error("[cancelOrder] Error:", err);
        res.status(500).json({
            status: false,
            message: "Failed to cancel order",
            error: err.message || "Unexpected error"
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = +req.params.id;

        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                events: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!order) {
            res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (err: any) {
        console.error("[getOrderById] Error:", err);
        res.status(500).json({
            status: false,
            message: "Failed to fetch order",
            error: err.message || "Unexpected error"
        });
    }
};


export const changeOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = +req.params.id;
        const { status } = req.body;

        // Validate incoming status against enum
        const validStatuses = [
            "PENDING",
            "ACCCEPTED", 
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!validStatuses.includes(status)) {
            res.status(400).json({
                status: false,
                message: "Invalid order status.",
                error: `Status must be one of: ${validStatuses.join(", ")}`
            });
        }

        const order = await prismaClient.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        // Add a new order event to track status change
        const updatedEvent = await prismaClient.orderEvent.create({
            data: {
                orderId,
                status
            }
        });

        res.status(200).json({
            status: true,
            message: `Order status updated to ${status}`,
            data: updatedEvent
        });
    } catch (err: any) {
        console.error("[changeOrderStatus] Error:", err);
        res.status(500).json({
            status: false,
            message: "Failed to update order status",
            error: err.message || "Unexpected error"
        });
    }
};
