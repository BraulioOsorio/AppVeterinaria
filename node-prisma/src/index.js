import express from "express";
import  userRoutes from "./routes/user.routes.js";
import  postRoutes from "./routes/post.routes.js";
import logger from "morgan";
const app = express()
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(express.json())
app.use('/api',userRoutes)
app.use('/api',postRoutes)

app.listen(port, () => {
    console.log(` server on port ${port} `);
})