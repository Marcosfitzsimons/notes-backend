import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import { db } from "../lib/db.js"


export const registerService = async (username, email, password) => {
    if (!username || !email || !password) {
        throw new BadRequestError('Username, email and password must be provided');
    }

    if (password.length < 6) throw new BadRequestError('Password must be at least 6 characters')

    const emailLowercase = email.toLowerCase()
    const usernameLowercase = username.toLowerCase()

    const userExists = await db.user.findMany({
        where: {
            OR: [
                {
                    email: emailLowercase,
                },
                {
                    username: usernameLowercase,
                },
            ],
        },
    })

    if (userExists.length > 0) {
        throw new BadRequestError('Email or username already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await db.user.create({
        data: {
            username: usernameLowercase,
            email: emailLowercase,
            password: hash
        },
    })
    if (!user) {
        throw new BadRequestError('Error when creating user');
    }

    return {
        message: "User created successfully"
    }
}

export const loginService = async (username, password) => {
    if (!username || !password) throw new BadRequestError('Username and password must be provided')

    const usernameLowercase = username.toLowerCase()

    let user = await db.user.findUnique({
        where: {
            username: usernameLowercase,
        },
    });
    if (!user) throw new UnauthenticatedError('User does not exist')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new BadRequestError('Incorrect password')

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT,
        { expiresIn: process.env.JWT_LIFETIME }
    )

    return {
        user,
        token
    }
}