const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser')
const DB = require("./dbConnection/connection")
//user Routes
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin')
const { compile } = require('ejs');

//connecting database
DB()

//socket io connection
const server = app.listen(8000, () => {
  console.log('Server started at 8000');
});

const io =require('socket.io')(server)
io.on('connection',(socket)=>{
  console.log('hello from server');
})

// passing io instance to blog route

const blogRoute = require('./routes/blog')(io)

//setting view
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.resolve('./views'));

//middlewares
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/blog',blogRoute)
app.use('/admin',adminRoute)
app.use('/', userRoute);

//404 page.
app.use((req, res) => {
    res.status(404).render('404');
  });


  


