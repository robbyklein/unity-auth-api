import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import validateEmail from '../helpers/validateEmail'
import prisma from '../initializers/prisma'
import jwt from 'jsonwebtoken'

const create = async (req: Request, res: Response) => {
  try {
    // Get data off body
    const { email, password } = req.body

    // Validate it
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email.')
    } else if (!password || password.trim().length < 8) {
      throw new Error('Password must be 8+ characters.')
    }

    // Create password hash
    const passwordHash = bcrypt.hashSync(password, 8)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
      },
    })

    // Create a token
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || '')

    res.json({ token })
  } catch (err) {
    console.error(err)
    const error = err as Error

    if (error.name == 'PrismaClientKnownRequestError') {
      res.status(400).json({ error: "You've already signed up." })
    } else {
      res.status(400).json({ error: (error as Error).message })
    }
  }
}

export default { create }
