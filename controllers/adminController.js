import bcrypt from 'bcrypt';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

import { parseBusinessData } from '../helpers/businessHelper.js';

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
        res.render('admin/settings', { business});
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
