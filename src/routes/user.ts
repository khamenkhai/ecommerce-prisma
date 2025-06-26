import { Router } from 'express';
import { addAddress,deleteAddress,listAddress} from '../controllers/user-controller';
import authMiddleware from '../middlewares/auth';

const userRoutes = Router();

userRoutes.post('/address', addAddress);
userRoutes.delete('/address/:id', deleteAddress);
userRoutes.get('/address',  [authMiddleware], listAddress);

export default userRoutes;
