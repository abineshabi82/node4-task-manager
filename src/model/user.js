require('../db/mongoose.js')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task=require('./task.js')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(x) {
            if (!validator.isEmail(x))
                throw new Error('enter valid email')
        }
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
        validate(x) {
            if (x.includes('password'))
                throw new Error('type other password and should min of 8 or max of 16 letters')
        }
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        max: 50
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    avator:{
        type:Buffer
    }
},{
    timestamps:true,
    toJSON:{virtuals:true}
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function () {
    let user = this
    let userObj = user.toObject()
    delete userObj.tokens
    delete userObj.password
    delete userObj.avator
    return userObj
}

userSchema.methods.generateToken = async function () {
    let user = this
    let token = await jwt.sign({ _id: user._id }, process.env.JWT_SCREATE)
    debugger
    let alreadyExit = user.tokens.find(x => {
        x;
        debugger
        return x.token == token
    });
    if (!alreadyExit)
        user.tokens.push({ token })
    await user.save()
    return token
}

userSchema.statics.logInCredenials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("unable to login")
    }
    ismatch = await bcrypt.compare(password, user.password)
    if (!ismatch)
        throw new Error("unable to login")

    return user
}

//To hash password before saving
userSchema.pre('save', async function (next) {
    user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User