import { body, param } from 'express-validator';
import { prisma } from '../db/index.js';

export const createPostValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').optional(),
  body('authorId').custom(async (value, { req }) => {
    try {
      console.log('Validating author ID...',value);
      const user = await prisma.user.findUnique({ where: { id: parseInt(value) || -1 } });
      if (!user) {
        throw new Error('Author with this ID does not exist');
      }
    } catch (error) {
      throw new Error('Failed to validate author ID');
    }
  })
];

export const findPostValidation = [
  param('id').custom(async (value) => {
      const post = await prisma.post.findUnique({ where: { id: parseInt(value) } });
      if (!post) {
        throw new Error('Post with this ID does not exist');
      }
    })
];

export const deletePostValidation = [
  param('id').custom(async (value) => {
      const post = await prisma.post.findUnique({ where: { id: parseInt(value) } });
      if (!post) {
        throw new Error('Post with this ID does not exist');
      }
    })
];

export const updatePostValidation = [
  param('id').custom(async (value) => {
      const post = await prisma.post.findUnique({ where: { id: parseInt(value) } });
      if (!post) {
        throw new Error('Post with this ID does not exist');
      }
    }),
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('content').optional(),
  body('authorId').optional().isInt().custom(async (value, { req }) => {
    if (value !== undefined) {
      try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(value) || -1 } });
        if (!user) {
          throw new Error('Author with this ID does not exist');
        }
      } catch (error) {
        throw new Error('Failed to validate author ID');
      }
    }
  })
];

export default {
    createPostValidation,
    findPostValidation,
    deletePostValidation,
    updatePostValidation
  };