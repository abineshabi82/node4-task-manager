const req = require('supertest')
const app = require('./../src/app.js')
const Task = require('./../src/model/task.js')
const jwt = require('jsonwebtoken')
const {user,objId,setupDb,task2} = require('./fixtures/db.js')



beforeEach(async () => {
    await setupDb()
})

test('should create task for user',async()=>{
    const res=await req(app)
                        .post('/task')
                        .set('Authorization',`Bearer ${user.tokens[0].token}`)
                        .send({
                            "description":"task-1"
                        })
                        .expect(201)
    const task=await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get only user related tasks',async()=>{
    const res=await req(app)
                        .get('/task')
                        .set('Authorization',`Bearer ${user.tokens[0].token}`)
                        .send()
                        .expect(200)
    expect(res.body.length).toBe(2)
})

test('should not delete others task',async()=>{
    await req(app)
                .delete(`/task/${task2._id}`)
                .set('Authorization',`Bearer ${user.tokens[0].token}`)
                .send()
                .expect(404)
    const task=await Task.findById(task2._id)
    expect(task).not.toBeNull()
})