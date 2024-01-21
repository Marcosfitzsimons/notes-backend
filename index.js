import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import credentials from './middleware/credentials.js'
import corsOptions from './config/corsOptions.js'
import authRoute from './routes/auth.js'
import notesRoute from './routes/notes.js'
import { verifyUser } from './middleware/verifyToken.js'

const app = express()

// .env
dotenv.config()

// middlewares

app.use(credentials)
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRoute)
app.use("/api/notes", verifyUser, notesRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})


const port = process.env.PORT || 8800;

app.listen(port, () =>
    console.log(`Connected to backend. Server is listening on port ${port}...`)
);