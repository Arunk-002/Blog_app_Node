const mongoose = require('mongoose')

const blogSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Blog = mongoose.model('Blog',blogSchema)

module.exports=Blog