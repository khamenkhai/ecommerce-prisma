import express, { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import { JWT_SECRET } from '../secret';
import jwt from 'jsonwebtoken';
import { BadRequestsException } from '../exceptions/bad_request';
import { ErrorCodes } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignupSchema } from '../schema/user';
import { NotFoundException } from '../exceptions/not-found-exception';



export const me = async (req: Request, res: Response) => {
    res.json(req.user);
}

export const login = async (req: Request, res: Response,) => {

    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw new NotFoundException("User does not existed!", ErrorCodes.USER_ALREADY_EXIST);
        // throw new BadRequestsException("User does not existed!", ErrorCodes.USER_ALREADY_EXIST);
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException("Incorrect password!", ErrorCodes.INCORRECT_PASWORD);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
}


export const register = async (req: Request, res: Response, next: NextFunction) => {

    try {

        SignupSchema.parse(req.body);

        const { name, email, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });

        if (user) {
            throw new BadRequestsException("User already existed!", ErrorCodes.USER_ALREADY_EXIST);
        }

        user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashSync(password, 10)
            }
        });

        res.json(user);
    } catch (err: any) {
        new UnprocessableEntity(err?.issues, "Unprocessable", ErrorCodes.UNPROCESSABLE_ENTITY);
    }
}