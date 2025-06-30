import { Router } from 'express';
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct, createManyProducts } from '../controllers/product-controller';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const productRoutes = Router();

// Apply auth middleware to all product routes
// productRoutes.use(authMiddleware);

productRoutes.get('', getProducts);
productRoutes.get('/:id', getProduct);
productRoutes.post('', [authMiddleware, adminMiddleware], createProduct);
productRoutes.post('/many', authMiddleware, createManyProducts);
productRoutes.put('/:id', updateProduct);
productRoutes.delete('/:id', deleteProduct);

export default productRoutes;
