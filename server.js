const express = require('express');
const path = require('path');
const userRoute =require('./src/routes/userRoutes')
const connectDB =require('./src/config/database')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Static files - serve all static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(session({
  secret: 'hahaha',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', userRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Development routes available at:`);
    console.log(`- Homepage: http://localhost:${PORT}/homepage-view`);
    console.log(`- Login/Register: http://localhost:${PORT}/index-view`);
    console.log(`- Rooms: http://localhost:${PORT}/rooms-view`);
    console.log(`- Subscriptions: http://localhost:${PORT}/subscriptions-view`);
    console.log(`- Profile: http://localhost:${PORT}/profile-view`);
    console.log(`- Contact: http://localhost:${PORT}/contact-view`);
   
});