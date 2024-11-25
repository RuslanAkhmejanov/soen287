import bcrypt from 'bcrypt';
import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import SequelizeStoreConstructor from 'connect-session-sequelize';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import upload from './middlewares/upload.js';

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactSupportRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import { parseBusinessData, safeParseJSON } from './helpers/businessHelper.js';

const app = express();
const PORT = 5000;

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('./models/index.cjs');
const { sequelize } = db;

// sequelize session store
const SequelizeStore = SequelizeStoreConstructor(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });
// against forging (server uses it to verify session IDs)
const sessionSecret = crypto.randomBytes(64).toString('hex');

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

// middleware
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (handles nested fields)
app.use(express.json()); // Parse JSON bodies

// // configuration of express-session with connect-session-sequelize
app.use(session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },  // 1 day
}));

// Use the parseRequestFields middleware before multer
app.use(parseRequestFields);

// set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// register routes
app.use(authRoutes);
app.use(contactRoutes);
app.use(accountRoutes);
app.use(businessRoutes);
app.use(adminRoutes);

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
        console.error('Failed to create admin:', error);
    }
})();

// default business setup
(async () => {
    try {
        // record filds
        const name = 'Hair Salon';
        const hours = {
            businessHours: '9 AM - 5 PM',
            saturday: '10 AM - 4 PM',
            sunday: 'Closed'
        };
        const logos = {
            svg: '/assets/favicon.svg',
            png: '/assets/favicon.png'
        };
        const backgroundPics = {
            homePage: '/client-side/images/homepage.jpeg',
            authPage: '/auth/assets/background1.jpg'
        };
        const services = [
            {
                name: "Coloring",
                price: 100,
                description: "Revitalize your hair with our professional coloring services. Whether you're looking for bold highlights, natural balayage, or a complete color change, our skilled colorists will deliver vibrant, lasting results.",
                image: "/client-side/images/coloring.jpeg" 
            },
            {
                name: "Haircut Women",
                price: 60,
                description: "Our women’s haircut services offer personalized styling tailored to your unique preferences. Whether you desire a chic bob, layered cut, or something bold, we ensure a flawless finish every time.",
                image: "/client-side/images/womencut.jpeg" 
            },
            {
                name: "Haircut Men",
                price: 50,
                description: "Achieve a sharp and polished look with our expert men’s haircut services. From classic styles to modern trends, our barbers deliver precision and attention to detail for a fresh, confident look.",
                image: "/client-side/images/mencut.jpeg" 
            },
            {
                name: "Styling",
                price: 70,
                description: "Elevate your look with our professional hair styling services. From sleek updos to soft waves, we create styles that perfectly complement any occasion, ensuring you leave feeling fabulous.",
                image: "/client-side/images/styling.jpeg" 
            },
        ];
        const staffMembers = [
            {
                name: "Sarah Williams",
                jobTitle: "Senior Hairstylist",
                bio: "With over 10 years of experience, Sarah specializes in color correction, balayage, and precision cutting. She offers expert care for all hair types and is certified in advanced coloring techniques.",
                image: "/client-side/images/Sarah.jpeg"
            },
            {
                name: "Jasmine Lee",
                jobTitle: "Creative Stylist",
                bio: "Jasmine brings creativity to every session with her expertise in fashion-forward colors and men's grooming. She’s known for her artistic approach to haircuts and styles.",
                image: "/client-side/images/Jasmine.jpeg"
            },
            {
                name: "Mark Reynolds",
                jobTitle: "Salon Manager & Hairstylist",
                bio: "With 12 years of experience in both styling and management, Mark specializes in classic cuts, professional styling, and customer service. Organized and friendly, he ensures the salon runs smoothly while providing top-tier service to every client.",
                image: "/client-side/images/Mark.jpeg"
            },
            {
                name: "Emily Turner",
                jobTitle: "Junior Stylist",
                bio: "With two years of experience as an assistant and stylist, Emily specializes in blowouts, hair braiding, and color treatments. Bubbly and enthusiastic, she is passionate about learning new techniques and delivering top-notch service.",
                image: "/client-side/images/Emily.jpeg"
            },
        ];

        const numOfBusinesses = await db.Business.count();
        let hairSalon;
        if (numOfBusinesses === 0) { // that means the table is empty, so we need to create a record
            hairSalon = await db.Business.create({
                name: name,
                hours: hours,
                logos: logos,
                backgroundPics: backgroundPics,
                staffMembers: staffMembers,
                services: services
            })
            console.log('Hair Salon successfully created');
        }
    } catch (error) {
        console.error('Failed to create Hair Salon', error);
        res.status(500).send();
    }
})();

// Home page
app.get('/', async (req, res) => {
    const isLoggedIn = req.session.userId ? true : false;
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });
        parseBusinessData(business);
        res.render('client-side/home', { business, isLoggedIn});
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

// start the server
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
