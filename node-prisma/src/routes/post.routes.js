import { Router } from "express";
import { prisma } from "../db/index.js";
import { validationResult } from 'express-validator';

import validations from '../validators/validationsPost.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({ include: { author: true } });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/createPost', validations.createPostValidation, validate, async (req, res) => {
    console.log('Request body:', req.body);
    try {

        const newPost = await prisma.post.create({ data: req.body });

        res.json(newPost);
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/findPost/:id', validations.findPostValidation, validate, async (req, res) => {
    try {
        const post = await prisma.post.findFirst({ where: { id: +req.params.id } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deletePost/:id', validations.deletePostValidation, validate, async (req, res) => {
    try {
        const postDelete = await prisma.post.delete({ where: { id: +req.params.id } });
        if (!postDelete) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/updatePost/:id',validations.updatePostValidation ,validate, async (req, res) => {
    try {
        const postUpdate = await prisma.post.update({ where: { id: +req.params.id }, data: req.body });
        if (!postUpdate) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(postUpdate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
