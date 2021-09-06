const req = require('supertest')
const app = require('../src/app.js')
const User = require('../src/model/user.js')
const jwt = require('jsonwebtoken')
const {user,objId,setupDb} = require('./fixtures/db.js')



beforeEach(async () => {
    await setupDb()
})

test('should signup create user', async () => {
    const res = await req(app).post('/user/signup').send({
        "name": "ram",
        "email": " ram@gmail.com  ",
        "password": "12345678",
        "age": 24
    }).expect(201);

    //Testing wheather the doc is correcting save in db 
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBe(null)
    console.log(res.body)

    expect(res.body).toMatchObject({
        user: {
            "name": "ram",
            "email": "ram@gmail.com",
            "age": 24
        },
        token: user.tokens[0].token
    })

})

test("should login", async () => {
    const res = await req(app).post('/user/login').send({
        "email": "kumar@gmail.com",
        "password": "12345678"
    }).expect(200);
 
    const user = await User.findById(res.body.user._id)
    expect(res.body.token).toBe(user.tokens[user.tokens.length-1].token)
});

test("should login fails for wronge credenials", async () => {
    await req(app).post('/user/login').send({
        "email": "kumar@gmail.com",
        "password": "123456"
    }).expect(400);
});

test("should get user profile", async () => {
    await req(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${jwt.sign({ _id: objId }, process.env.JWT_SCREATE)}`)
        .send()
        .expect(200)
})

test("should not get user profile when auth token is not provide", async () => {
    await req(app)
        .get('/user/me')
        .send()
        .expect(401)
})

test("should delete user profile", async () => {
    const res = await req(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${jwt.sign({ _id: objId }, process.env.JWT_SCREATE)}`)
        .send()
        .expect(200)

    const user = await User.findById(res.body._id)
    expect(user).toBeNull();
})

test("should not delete user profile without token", async () => {
    await req(app)
        .delete('/user/me')
        .send()
        .expect(401)
})

test("should upload image", async () => {
    await req(app)
        .post('/user/me/avator')
        .set('Authorization', `Bearer ${jwt.sign({ _id: objId }, process.env.JWT_SCREATE)}`)
        .attach('avator', 'test/fixtures/logo.png')
        .expect(200)

    const user = await User.findById(objId)
    expect(user.avator).toEqual(expect.any(Buffer))
})

test("should update valid fields", async () => {
    await req(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${jwt.sign({ _id: objId }, process.env.JWT_SCREATE)}`)
        .send({
            "name": "raman",
            "email": "raman@gmail.com"
        }).expect(200)
    const user = await User.findById(objId)
    expect(user.name).toBe("raman")
})

test("should not update invalid fields", async () => {
    await req(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${jwt.sign({ _id: objId }, process.env.JWT_SCREATE)}`)
        .send({
            "name": "raman",
            "quantity": "raman@gmail.com"
        }).expect(400)
})