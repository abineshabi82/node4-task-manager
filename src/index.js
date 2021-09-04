const express=require('express')

const app=express()
const userRoute=require('./router/user.js')
const taskRoute=require('./router/task.js')
const port=process.env.PORT

// app.use((req,res,next)=>{
//     return res.status(503).json({error:"temporaryly disabled for maintaince try again later"})
// })

app.use(express.json())
app.use('/user',userRoute)
app.use('/task',taskRoute)

app.listen(port,()=>{
    console.log('server started on port '+ port)
})