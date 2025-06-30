import { Router } from 'express';
import {
    createOrder,
    cancelOrder,
    getOrderById,
    listOrders,
    changeOrderStatus
} from '../controllers/order-controller';
import authMiddleware from '../middlewares/auth';

const orderRoutes = Router();

orderRoutes.use(authMiddleware);

// Create a cart item
orderRoutes.get('/', listOrders);
orderRoutes.post('/', createOrder);
orderRoutes.get('/:id', getOrderById);
orderRoutes.delete('/:id', cancelOrder);
orderRoutes.post('/:id/status', changeOrderStatus);

export default orderRoutes;
