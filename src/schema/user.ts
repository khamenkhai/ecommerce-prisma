import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});


export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),        // Optional in Prisma (String?), use nullable
  pinCode: z.string().length(6),         // Use "pinCode" to match Prisma
  country: z.string(),
  city: z.string(),
  userId: z.number(),                     // Int in Prisma → number in Zod
  formattedAddress: z.string().optional()
});

export const CartItemSchema = z.object({
  userId: z.number({
    required_error: 'userId is required',
    invalid_type_error: 'userId must be a number'
  }),

  productId: z.number({
    required_error: 'productId is required',
    invalid_type_error: 'productId must be a number'
  }),

  quantity: z.number({
    required_error: 'quantity is required',
    invalid_type_error: 'quantity must be a number'
  }).min(1, 'Quantity must be at least 1'),
});