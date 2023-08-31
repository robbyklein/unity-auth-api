import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../initializers/prisma'

const login = async (req: Request, res: Response) => {
  try {
    // Get data off body
    const { email, password } = req.body

    // Find the user
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user || !password || !user.password) {
      throw new Error('User not found')
    }

    // Validate the password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid password')
    }

    // Create a token
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || '')

    // Send it to the user
    res.json({ token })
  } catch (err) {
    res.status(401).json({ error: 'Invalid email or password.' })
  }
}

const validate = async (req: Request, res: Response) => {
  try {
    const token = req.get('Authorization')
    const decoded = jwt.verify(token || '', process.env.JWT_SECRET || '')

    res.json(decoded)
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

export default { login, validate }
