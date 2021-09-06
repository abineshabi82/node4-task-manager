const express=require('express')

const app=express()
const userRoute=require('./router/user.js')
const taskRoute=require('./router/task.js')

app.use(express.json())
app.use('/user',userRoute)
app.use('/task',taskRoute)

module.exports=app