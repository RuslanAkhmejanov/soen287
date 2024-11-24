import bcrypt from 'bcrypt';
import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import SequelizeStoreConstructor from 'connect-session-sequelize';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import multer from 'multer';
import upload from './middlewares/upload.js'; // Import the multer configuration

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactSupportRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import businessRoutes from './routes/businessRoutes.js';

const app = express();
const PORT = 5001;

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('./models/index.cjs');
const { sequelize } = db;

// admin setup
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

// sequelize session store
const SequelizeStore = SequelizeStoreConstructor(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });
// against forging (server uses it to verify session IDs)
const sessionSecret = crypto.randomBytes(64).toString('hex');

// Middleware setup
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (handles nested fields)
app.use(express.json()); // Parse JSON bodies

// Configure session middleware
app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },  // 1 day
}));

// Safe JSON parsing function
const safeParseJSON = (json) => {
    try {
        return typeof json === 'string' ? JSON.parse(json) : json;
    } catch (error) {
        console.error('JSON parsing error:', error);
        return [];
    }
};

// Middleware to parse request fields
const parseRequestFields = (req, res, next) => {
    try {
        req.body.staffMembers = safeParseJSON(req.body.staffMembers || "[]");
        req.body.services = safeParseJSON(req.body.services || "[]");
        next();
    } catch (error) {
        console.error('Error parsing request fields:', error.message);
        res.status(400).send({ error: 'Invalid request fields' });
    }
};

// Use the parseRequestFields middleware before multer
app.use(parseRequestFields);

// register routes
app.set('view engine', 'ejs');
app.set('views', 'views');

// Register routes
app.use(authRoutes);
app.use(contactRoutes);
app.use(accountRoutes);
app.use(businessRoutes);

// Default values for services and staff members
const defaultServices = [
  { name: "Haircut", image: "/client-side/images/haircut.jpeg", description: "Precision haircuts tailored to your style." },
  { name: "Coloring", image: "/client-side/images/coloring.jpeg", description: "Professional coloring services for all hair types." },
  { name: "Styling", image: "/client-side/images/styling.jpeg", description: "Custom styling for any occasion." }
];

const defaultStaffMembers = [
  { name: "Sarah Williams", bio: "Expert in color correction and precision cutting.", image: "/client-side/images/Sarah.jpeg" },
  { name: "Jasmine Lee", bio: "Creative colors and men's grooming expert.", image: "/client-side/images/Jasmine.jpeg" },
  { name: "Mark Reynolds", bio: "Classic cuts and professional styling.", image: "/client-side/images/Mark.jpeg" },
  { name: "Emily Turner", bio: "Blowouts, braiding, and color treatments.", image: "/client-side/images/Emily.jpeg" }
];

// Home page
app.get('/', async (req, res) => {
    const isLoggedIn = req.session.userId ? true : false;
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });

        const staffMembers = safeParseJSON(business.staffMembers || "[]");
        const services = safeParseJSON(business.services || "[]");

        res.render('client-side/home', { business, isLoggedIn, staffMembers, services });
    } catch (error) {
        console.error('Error fetching business information:', error.message);
        res.status(500).send('Error fetching business information');
    }
});

// settings page
app.get('/settings', async (req, res) => {
    try {
        const business = await db.Business.findOne({ where: { id: 1 } });

        let staffMembers = [];
        let services = [];

        if (business) {
            staffMembers = safeParseJSON(business.staffMembers || "[]");
            services = safeParseJSON(business.services || "[]");
        }

        res.render('settings', { business, staffMembers, services });
    } catch (error) {
        console.error('Error fetching business information:', error.message);
        res.status(500).send('Error fetching business information');
    }
});

app.post('/settings', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'backgroundPic', maxCount: 1 },
    { name: 'staffMembers[][image]', maxCount: 1 },
    { name: 'services[][image]', maxCount: 1 }
]), async (req, res) => {
    const { name, hours, staffMembers, services } = req.body;

    // Process staff member data
    const staffMemberData = safeParseJSON(staffMembers).map((staffMember, index) => ({
        name: staffMember.name,
        bio: staffMember.bio,
        image: req.files[`staffMembers[${index}][image]`]?.[0]?.path || staffMember.image || null,
    }));

    // Process service data
    const serviceData = safeParseJSON(services).map((service, index) => ({
        name: service.name,
        description: service.description,
        image: req.files[`services[${index}][image]`]?.[0]?.path || service.image || null,
    }));

    try {
        const business = await db.Business.findOne({ where: { id: 1 } });

        if (business) {
            await business.update({
                name: name || business.name,
                hours: hours || business.hours,
                staffMembers: JSON.stringify(staffMemberData.length ? staffMemberData : business.staffMembers),
                services: JSON.stringify(serviceData.length ? serviceData : business.services),
            });
        } else {
            await db.Business.create({
                name: name || 'Your Business Name',
                hours: hours || 'Your Hours Info',
                staffMembers: JSON.stringify(staffMemberData),
                services: JSON.stringify(serviceData),
                logo: req.files.logo ? req.files.logo[0].path : 'public/assets/default_logo.png',
                backgroundPic: req.files.backgroundPic ? req.files.backgroundPic[0].path : 'public/client-side/images/default_background.jpeg',
            });
        }

        res.redirect('/settings');
    } catch (error) {
        console.error('Error saving business information:', error.message);
        res.status(500).send('Error saving business information');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// sync the session table with the database
(async () => {
    try {
        await sequelize.sync();
        await sessionStore.sync();
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing the database:', error.message);
    }
})();