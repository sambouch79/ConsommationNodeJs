const express=require('express')
const userRouter=require('./routers/user')
const consommationRouter=require('./routers/consommation')
const app=express()
const port=process.env.PORT||3000
app.use(express.json())
app.use(userRouter)
app.use(consommationRouter)

app.listen(port,()=>{
    console.log('app listen on port'+port)
})