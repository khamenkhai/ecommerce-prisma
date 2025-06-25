import express, { Express, Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes/rootRoutes';
import { PrismaClient } from '../generated/prisma';
import { errorMiddleware } from './middlewares/errors';
import { SignupSchema } from './schema/user';

const app: Express = express();

// ✅ Add this line to parse JSON request bodies
app.use(express.json());

app.use("/api", rootRouter);

app.use(errorMiddleware);

export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    query : {
        user : {
            create({ args, query }){
                args.data = SignupSchema.parse(args.data);
                return query(args);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`App is working in : ${PORT}`);
})