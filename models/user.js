const { status } = require('express/lib/response')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    status:{
        type:String,
        enum:['active','cancel','suspended'],
        default:'active'
    }
},{timestamps:true})

const User = mongoose.model('user',userSchema)

module.exports=User