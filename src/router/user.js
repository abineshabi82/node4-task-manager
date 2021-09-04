const express = require('express')
const { ObjectId } = require('mongodb')
const User = require('../model/user.js')
const auth = require('../middleware/auth.js')
const multer = require('multer')
const Sharp=require('sharp')

const userRoute = express.Router()

userRoute.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        let token = await user.generateToken.call(user)
        res.status(201).json({ user, token })
    }
    catch (err) {
        res.status(400).json(err)
    }

})

userRoute.post('/login', async (req, res) => {

    try {
        const user = await User.logInCredenials(req.body.email, req.body.password)
        if (!user)
            return res.status(404).json({ error: 'unable to login' })
        let token = await user.generateToken.call(user)

        res.status(200).json({ user, token })
    }
    catch (err) {
        res.status(400).json(err)
    }

})

userRoute.post('/logout', auth, async (req, res) => {

    try {
        const user = req.user
        if (!user)
            return res.status(404).json({ error: 'unable to logout' })

        user.tokens = user.tokens.filter(x => x.token != req.token)
        await user.save()

        res.status(200).json({ user })
    }
    catch (err) {
        res.status(400).json(err)
    }

})

userRoute.post('/logoutall', auth, async (req, res) => {

    try {
        const user = req.user
        if (!user)
            return res.status(404).json({ error: 'unable to logout' })

        user.tokens = []
        await user.save()

        res.status(200).json({ user })
    }
    catch (err) {
        res.status(400).json(err)
    }

})

const uploads = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error("pls upload img type"))
        }
        callback(undefined, true)
    }
})

userRoute.get('/me/avator/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id:req.params.id})
        if(!user||!user.avator)
        return res.status(404).json({error:err})

        res.set('Content-Type', 'image/png')
        res.send(user.avator)
    } catch (err) {
        res.status(404).json({error:err})
    }
})

userRoute.post('/me/avator', auth, uploads.single('avator'), async (req, res) => {
    req.user.avator = await Sharp(req.file.buffer).resize({width:500,height:500}).png().toBuffer()
    await req.user.save()
    res.json(res.user);
}, (err, req, res, next) => {
    res.status(400).json({ error: err.message })
})


userRoute.delete('/me/avator', auth, async (req, res) => {
    req.user.avator = undefined
    await req.user.save()
    res.json(res.user);
}, (err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

userRoute.get('/me', auth, async (req, res) => {
    try {
        const user = req.user
        if (!user)
            res.status(404).json({})

        res.json(user)
    }
    catch (err) {
        res.status(400).json(err)
    }

    // User.find()
    //     .then(users => {
    //         if (!users)
    //             res.status(404).json({})

    //         res.json(users)
    //     })
    //     .catch(err => {
    //         res.status(500).json(err)
    //     })
})

// userRoute.get('/:id', async (req, res) => {

//     try {
//         const user = await User.findById(req.params.id)
//         if (!user)
//             res.status(404).json({})

//         res.json(user)
//     }
//     catch (err) {
//         res.status(400).json(err)
//     }

//     // User.findById(req.params.id)
//     //     .then(user => {
//     //         if (!user)
//     //             res.status(404).json({})

//     //         res.json(user)
//     //     })
//     //     .catch(err => {
//     //         res.status(500).json(err)
//     //     })
// })

userRoute.patch('/me', auth, async (req, res) => {
    const allowedUpdates = ["name", "email", "age", "password"];
    const updates = Object.keys(req.body);
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).json({ error: "bad request" })
    try {
        let user;
        if (req.body.password) {
            user = req.user
            Object.keys(req.body).forEach(pro => user[pro] = req.body[pro])
            user = await user.save()
        }
        else
            user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
        if (!user)
            return res.status(404).json({ error: "not found" })

        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json(err);
    }
})

userRoute.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.json(req.user);
    } catch (err) {
        return res.status(404).json({ error: err });
    }
})

module.exports = userRoute