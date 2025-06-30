import { Router } from 'express';
import {
  addItemToCart,
  deleteItemFromCart,
  getCart,
  changeQuantity
} from '../controllers/cart-controller';
import authMiddleware from '../middlewares/auth';

const cartRoutes = Router();

cartRoutes.use(authMiddleware);

// Create a cart item
cartRoutes.post('/', addItemToCart);
cartRoutes.get('/:id', getCart);
cartRoutes.delete('/:id', deleteItemFromCart);
cartRoutes.put('/:id', changeQuantity);

export default cartRoutes;
