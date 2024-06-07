import { Router } from 'express';
import { prisma } from '../db/index.js';
import { validationResult } from 'express-validator';
import validations from '../validators/validationsUsers.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.json(users);
});

router.post('/createUser', validations.createUserValidation, validate, async (req, res) => {
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

router.get('/findUser/:id', validations.findUserValidation, validate, async (req, res) => {
    try {
        const user = await prisma.user.findFirst({ where: { id: +req.params.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
        
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteUser/:id', validations.deleteUserValidation, validate, async (req, res) => {
    try {
        const userDelete = await prisma.user.delete({ where: { id: +req.params.id } });
        if(!userDelete){
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userDelete);
        
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/updateUser/:id', validations.updateUserValidation, validate, async (req, res) => {
    try {
        const userUpdate = await prisma.user.update({ where: { id: +req.params.id }, data: req.body });
        if (!userUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userUpdate);

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
