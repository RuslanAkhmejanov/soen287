// to prevent from accessing by unathorized users
export function authMiddleware(req, res, next) {
    if (req.session && req.session.userId) {
        // if user is authenticated; proceed to the next middleware or route handler
        return next();
    }
    res.redirect('/');
}
