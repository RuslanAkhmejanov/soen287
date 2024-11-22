import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const sendRequest = async (req, res) => {
    console.log("I am here");
    const { name = null, email, message } = req.body;
    try {
        await db.ContactMessage.create({
            name: name,
            email: email,
            message: message
        });
        res.redirect('/');
    } catch (err) {
        res.status(400).send();
        console.log(err);
    }
};
