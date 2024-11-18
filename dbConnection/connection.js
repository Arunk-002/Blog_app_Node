const mongoose = require('mongoose')
const connectDb = ()=>{
  try {
    mongoose.connect(process.env.MONGO_URL).then((err)=>{
        console.log('Database coonected');
    })
  } catch (error) {
    
  }
}
// 'mongodb://localhost:27017/blog_db'
module.exports  =  connectDb