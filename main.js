import express from 'express';

import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

// const { sequelize, Sequelize } = db;

// middleware
app.use(express.static('public'));  // to serve static files (html, css, js)
app.use(express.urlencoded({ extended: false }));  // parse url-encoded bodies (html encodes them)
app.use(express.json());  // parse in json format

// view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// register routes
app.use(authRoutes);

// default page
app.get('/', (req, res) => {
    res.render('client-side/home');
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
