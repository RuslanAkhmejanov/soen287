import bcrypt from 'bcrypt';
import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import SequelizeStoreConstructor from 'connect-session-sequelize';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactSupportRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const app = express();
const PORT = 5000;

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const db = require('./models/index.cjs');
const { sequelize } = db;

// Admin setup
(async () => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('admin', salt);
        const admin = await db.User.findOrCreate({
            where: { username: 'admin@gmail.com' },
            defaults: { name: 'admin', password: hashedPassword, isAdmin: true },
        });
        console.log('Admin created successfully.');
    } catch (error) {
        console.error(error);
    }
})();

// Configure session store
const SequelizeStore = SequelizeStoreConstructor(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });
const sessionSecret = crypto.randomBytes(64).toString('hex');

// Configure session middleware
app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));

// Middleware setup
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Register routes
app.use(authRoutes);
app.use(contactRoutes);
app.use(accountRoutes);
app.use(businessRoutes);
app.use(serviceRoutes);

// Default page
app.get('/', async (req, res) => {
    const isLoggedIn = req.session.userId ? true : false;
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });
        res.render('client-side/home', { business, isLoggedIn });
    } catch (error) {
        res.status(500).send();
    }
});

// Settings page
app.get('/settings', async (req, res) => {
    try {
        const business = await db.Business.findOne({ where: { id: 1 } });
        const services = await db.Service.findAll();
        res.render('settings', { business, services });
    } catch (error) {
        console.error('Error fetching business information:', error.message);
        res.status(500).send('Error fetching business information');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Sync the session table with the database
(async () => {
    await sequelize.sync();
    sessionStore.sync();
})();
