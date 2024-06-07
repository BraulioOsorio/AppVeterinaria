import { body, param } from 'express-validator';
import { prisma } from '../db/index.js';

export const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

export const findUserValidation = [
  param('id').isInt().withMessage('ID must be an integer').custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { id: parseInt(value) } });
      if (!user) {
        throw new Error('User with this ID does not exist');
      }
    })
];

export const deleteUserValidation = [
  param('id').custom(async (value) => {
    const user = await prisma.user.findUnique({ where: { id: parseInt(value) } });
    if (!user) {
      throw new Error('User with this ID does not exist');
    }
  })
];

export const updateUserValidation = [
  param('id').custom(async (value) => {
    const user = await prisma.user.findUnique({ where: { id: parseInt(value) } });
    if (!user) {
      throw new Error('User with this ID does not exist');
    }
  }),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];

export default {
  createUserValidation,
  findUserValidation,
  deleteUserValidation,
  updateUserValidation
};
