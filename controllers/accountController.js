import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

export const getAccount = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.session.userId);
        res.render('client-side/account', { user: user });
    } catch (error) {
        res.status(500).send();
    }
};
