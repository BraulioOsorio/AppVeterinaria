import { Router } from "express";
import { prisma } from "../db/index.js";
const router = Router()

router.get('/posts',async (req,res) => {
    const posts = await prisma.post.findMany({include:{author:true}})
    res.json(posts)
})

router.post('/createPost', async (req,res) =>{
    const newPost = await prisma.post.create({data:req.body})
    res.json(newPost)
})

router.get('/findPost/:id', async (req,res) => {
    let post = await prisma.post.findFirst({where:{id:+req.params.id}})
    res.json(post)
})

router.delete('/deletePost/:id', async (req,res) => {
    let postDelete = await prisma.post.delete({where:{id:+req.params.id}})
    res.json(postDelete)
})

router.put('/updatePost/:id', async (req,res) => {
    let postUpdate = await prisma.post.update({where:{id:+req.params.id},data:req.body})
    res.json(postUpdate)
})


export default router