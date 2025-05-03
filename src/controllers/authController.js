import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken'; // Add this line
import prisma from '../prismaClient.js';
import sendEmail from '../utils/email.js';



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, dealerId: user.dealerId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    if (req.io) {
      req.io.emit('userLoggedIn', {
        userId: user.id,
        role: user.role,
        message: 'User logged in successfully',
      });
    }

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const registerDealer = async (req, res) => {
  const { NIK, phoneNumber, address, email } = req.body;
  try {
    const dealer = await prisma.dealer.create({
      data: { NIK, phoneNumber, address, email },
    });

    const confirmationLink = `http://localhost:3000/auth/confirm-email/${dealer.id}`;
    await sendEmail(
      `${email}`,
      'Confirm your email',
      `Click the link: ${confirmationLink}`
    );

    res.status(201).json({ message: 'Dealer registered. Confirm email.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const confirmEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const dealer = await prisma.dealer.findUnique({ where: { id: parseInt(id) } });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    if (dealer.confirmed) {
      return res.status(400).json({ message: 'Email already confirmed' });
    }
    await prisma.dealer.update({
      where: { id: parseInt(id) },
      data: { confirmed: true },
    });

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error('Error confirming email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUserForDealer = async (req, res) => {
  const { dealerId, name, email, password } = req.body;

  try {
    const dealer = await prisma.dealer.findUnique({ where: { id: parseInt(dealerId) } });
    if (!dealer || !dealer.confirmed) {
      return res.status(400).json({ message: 'Dealer not found or email not confirmed' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        dealerId: dealer.id,
        name,
        email,
        password: hashedPassword,
        role: 'DEALER',
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, dealerId: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { registerDealer, confirmEmail, createUserForDealer, login, getProfile };