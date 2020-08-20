module.exports = function () {
    if (!req.body.isAdmin) return res.status(403).send('Access Denied');
    next();
}