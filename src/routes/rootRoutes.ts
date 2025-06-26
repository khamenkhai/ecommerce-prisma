import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './product';
import userRoutes from './user';
import cartRoutes from './cart';

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/cart', cartRoutes);

export default rootRouter;
