import bcrypt from 'bcrypt';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const getSignUp = (req, res) => {
    res.render('auth/signup', { error: null });
};

export const createUser = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await db.User.findOne({
            where: {
              username: username
            }
        });
        if (existingUser) {
            res.render('auth/signup', { error: '*username is already taken'});
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = { name: name, username: username, password: hashedPassword };
        await db.User.create(user);
        res.redirect("/signin");
    } catch (err) {
        res.status(400).send();
    }
};

export const getSignIn = (req, res) => {
    res.render('auth/signin', { error: null });
};

export const signInUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await db.User.findOne({
            where: {
              username: username
            }
        });
        if (!existingUser) {
            res.render('auth/signin', { error: '*user not found'});
            return;
        }
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (result) {
                req.session.userId = existingUser.id;
                res.redirect('/'); 
            } else {
                res.render('auth/signin', { error: '*incorrect password'});
            }
        });
    } catch (err) {
        res.status(400).send();
    }
    // res.render('signin', { error: null });
};

export const signOutUser = (req, res) => {
    req.session.destroy(err => {
    //   if (err) {
    //     return res.status(500).json({ error: 'Could not log out' });
    //   }
      res.clearCookie('connect.sid'); // Clear the cookie
    //   res.json({ message: 'Logged out successfully' });
      res.redirect('/');
    });
};
