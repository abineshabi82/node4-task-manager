const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./../../src/model/user.js')
const Task = require('./../../src/model/task.js')

const objId = new mongoose.Types.ObjectId();
const user = {
    "_id": objId,
    "name": "kumar",
    "email": "kumar@gmail.com",
    "password": "12345678",
    "tokens": [
        { "token": jwt.sign({_id:objId},process.env.JWT_SCREATE) }
    ]
}

const obj2Id = new mongoose.Types.ObjectId();
const user2 = {
    "_id": obj2Id,
    "name": "kumar1",
    "email": "kumar1@gmail.com",
    "password": "12345678",
    "tokens": [
        { "token": jwt.sign({_id:obj2Id},process.env.JWT_SCREATE) }
    ]
}

const taskId = new mongoose.Types.ObjectId();
const task={
    "_id":taskId,
    "description":"task-1",
    "completed":true,
    "owner":objId
}
const task1Id = new mongoose.Types.ObjectId();
const task1={
    "_id":task1Id,
    "description":"task-2",
    "owner":objId
}
const task2Id = new mongoose.Types.ObjectId();
const task2={
    "_id":task2Id,
    "description":"task-1",
    "owner":obj2Id
}

const setupDb=async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user).save()
    await new User(user2).save()
    await new Task(task).save()
    await new Task(task1).save()
    await new Task(task2).save()
}

module.exports={
    user,
    objId,
    setupDb,
    task2
}