import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import SequelizeStoreConstructor from 'connect-session-sequelize';

import authRoutes from './routes/authRoutes.js';

import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('./models/index.cjs');
const { sequelize, Sequelize } = db;

// sequelize session store
const SequelizeStore = SequelizeStoreConstructor(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });
// against forging (server uses it to verify session IDs)
const sessionSecret = crypto.randomBytes(64).toString('hex');

// configuration of express-session with connect-session-sequelize
app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));

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
    const isLoggedIn = req.session.userId ? true : false;
    res.render('client-side/home', { isLoggedIn });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// sync the session table with the database
await sequelize.sync();
sessionStore.sync();
