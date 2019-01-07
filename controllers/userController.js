const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.signupForm = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'Please supply a valid email address').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Pasword cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('signup', { title: 'Sign Up', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};
