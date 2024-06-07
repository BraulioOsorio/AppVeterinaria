import { Router } from "express";
import { prisma } from "../db/index.js";
const router = Router()

router.get('/users',async (req,res) => {
    const users = await prisma.user.findMany({include:{posts:true}})
    res.json(users)
})

router.post('/createUser', async (req,res) =>{
    const newUser = await prisma.user.create({data:req.body})
    res.json(newUser)
})

router.get('/findUser/:id', async (req,res) => {
    let user = await prisma.user.findFirst({where:{id:+req.params.id}})
    res.json(user)
})

router.delete('/deleteUser/:id', async (req,res) => {
    let userDelete = await prisma.user.delete({where:{id:+req.params.id}})
    res.json(userDelete)
})

router.put('/updateUser/:id', async (req,res) => {
    let userUpdate = await prisma.user.update({where:{id:+req.params.id},data:req.body})
    res.json(userUpdate)
})


export default router