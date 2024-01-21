import { loginService, registerService } from "../services/authService.js";
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../errors/index.js';


export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const message = await registerService(username, email, password)

    res.status(StatusCodes.CREATED).json({
        "success": message
    });
};

export const login = async (req, res) => {
    const { username, password } = req.body

    const { user, token } = await loginService(username, password)

    res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 3600 * 1000 });

    res.status(StatusCodes.OK).json({
        details: { id: user.id, username: user.username },
        token: token
    })

}

export const logout = async (req, res) => {
    // Delete the accessToken on client

    const cookies = req.cookies

    if (!cookies?.jwt) throw new UnauthenticatedError('Problem with cookies')

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); // Add secure: true

    return res.status(StatusCodes.NO_CONTENT).send();
}