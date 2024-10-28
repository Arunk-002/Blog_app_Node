const mongoose = require('mongoose')
const connectDb = ()=>{
  try {
    mongoose.connect('mongodb://localhost:27017/blog_db').then((err)=>{
        console.log('Database coonected');
    })
  } catch (error) {
    
  }
}

module.exports  =  connectDb