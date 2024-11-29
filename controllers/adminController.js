import bcrypt from 'bcrypt';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// import upload from './middlewares/upload.js';
import { parseBusinessData, convertTimeRange, convertTimeRangeBack } from '../helpers/businessHelper.js';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const getSignInAdmin = (req, res) => {
    res.render('admin/auth/signin', { error: null });
};

export const signInAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await db.User.findOne({
            where: {
              username: username,
              isAdmin: true
            }
        });
        if (!existingUser) {
            res.render('admin/auth/signin', { error: '*incorrect username or password'});
            return;
        }
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (result) {
                req.session.userId = existingUser.id;
                res.redirect('/admin'); 
            } else {
                res.render('admin/auth/signin', { error: '*incorrect username or password'});
            }
        });
    } catch (err) {
        res.status(400).send();
    }
};

// settings page
export const getAdmin = async (req, res) => {
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });
        parseBusinessData(business);
        convertTimeRange(business);
        const contactMessages = await db.ContactMessage.findAll();
        const appointments = await db.Appointment.findAll();
        res.render('admin/settings', { business, contactRequests: contactMessages, appointments });
    } catch (error) {
        console.error('Error fetching business information:', error.message);
        res.status(500).send('Error fetching business information');
    }
};

export const signOutAdmin = (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid'); // Clear the cookie
        res.redirect('/admin/signin');
    });
};

export const updateBusinessInfo = async (req, res) => {
    try {
        const business = await db.Business.findOne({
            order: [['id', 'DESC']]
        });
        parseBusinessData(business);
        const name = req.body.name, hours = convertTimeRangeBack(req.body.hours[0]), logo = req.files.logo;
        const homePageBackgroundPic = req.files.homePageBackgroundPic, authPageBackgroundPic = req.files.authPageBackgroundPic;

        business.name = name;
        business.hours = hours;
        if (logo) {
            if (logo[0].mimetype === 'image/png') {
                business.logos.png = '/uploads/' + logo[0].filename;
            } else if (logo[0].mimetype === 'image/svg+xml') {
                business.logos.svg = '/uploads/' + logo[0].filename;
            }
        }
        if (homePageBackgroundPic) {
            business.backgroundPics.homePage = '/uploads/' + homePageBackgroundPic[0].filename;
        }
        if (authPageBackgroundPic) {
            business.backgroundPics.authPage = '/uploads/' + authPageBackgroundPic[0].filename;
        }

        for (const key in req.files) {
            // Check if the key contains 'staffMembers' to target the right fields
            if (key.includes('staffMembers')) {
              // Use a regular expression to extract the index from the key
              const match = key.match(/\[([0-9]+)\]/);
              if (match) {
                const index = parseInt(match[1], 10);
          
                // Add the image data to the corresponding staff member object
                req.body.staffMembers[index].image = '/uploads/' + req.files[key][0].filename;
              }
            } else if (key.includes('services')) {
                // Use a regular expression to extract the index from the key
                const match = key.match(/\[([0-9]+)\]/);
                if (match) {
                    const index = parseInt(match[1], 10);
          
                    // Add the image data to the corresponding staff member object
                    req.body.services[index].image = '/uploads/' + req.files[key][0].filename;
                }
            }
        }

        const staffMembersInBody = req.body.staffMembers;
        const servicesInBody = req.body.services;

        business.staffMembers.forEach(staffMember => {
            const index2 = staffMembersInBody.findIndex(
                staffMemberInBody =>
                    staffMemberInBody.name === staffMember.name ||
                    staffMemberInBody.jobTitle === staffMember.jobTitle ||
                    staffMemberInBody.bio === staffMember.bio
            );
            if (index2 === -1) {
                // Remove the staffMember from the business.staffMembers array
                business.staffMembers = business.staffMembers.filter(member => member !== staffMember);
            }
        });

        business.services.forEach(service => {
            const index2 = servicesInBody.findIndex(
                serviceInBody =>
                    serviceInBody.name === service.name ||
                    serviceInBody.price === service.price ||
                    serviceInBody.description === service.description
            );
            if (index2 === -1) {
                // Remove the staffMember from the business.staffMembers array
                business.services = business.services.filter(serv => serv !== service);
            }
        });

        staffMembersInBody.forEach(staffMemberInBody => {
            const index2 = business.staffMembers.findIndex(
                staffMemberInDb =>
                    staffMemberInDb.name === staffMemberInBody.name ||
                    staffMemberInDb.jobTitle === staffMemberInBody.jobTitle ||
                    staffMemberInDb.bio === staffMemberInBody.bio
            );
            if (index2 !== -1) {
                if (staffMemberInBody.image) {
                    business.staffMembers[index2] = staffMemberInBody;
                } else {
                    business.staffMembers[index2].name = staffMemberInBody.name;
                    business.staffMembers[index2].jobTitle = staffMemberInBody.jobTitle;
                    business.staffMembers[index2].bio = staffMemberInBody.bio;
                }
            } else { // not found
                business.staffMembers.push(staffMemberInBody);
            }
        });

        servicesInBody.forEach(serviceInBody => {
            const index2 = business.services.findIndex(
                serviceInDb =>
                    serviceInDb.name === serviceInBody.name ||
                    serviceInDb.price === serviceInBody.price ||
                    serviceInDb.description === serviceInBody.description
            );
            if (index2 !== -1) {
                if (serviceInBody.image) {
                    business.services[index2] = serviceInBody;
                } else {
                    business.services[index2].name = serviceInBody.name;
                    business.services[index2].price = serviceInBody.price;
                    business.services[index2].description = serviceInBody.description;
                }
            } else { // not found
                business.services.push(serviceInBody);
            }
        });

        business.save(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
};
