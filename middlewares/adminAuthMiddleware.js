import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// not defined in ES modules, so need to manually do it
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const db = require('../models/index.cjs');

// to prevent from accessing by unathorized users
export async function adminAuthMiddleware(req, res, next) {
    try {
        const user = await db.User.findByPk(req.session.userId);
        if (req.session && req.session.userId && user.isAdmin) {
            // if user is authenticated and he is admin; proceed to the next middleware or route handler
            return next();
        }
    res.redirect('/');
    } catch (err) {
        res.status(500).send();
    }
}
