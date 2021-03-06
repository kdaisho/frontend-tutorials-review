const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');
const passport = require('passport');

router.get('/', (req, res) => { res.redirect('/courses') });
// router.get('/', courseController.getHomepage);
router.get('/courses', catchErrors(courseController.getCourses));
router.get('/courses/page/:page', catchErrors(courseController.getCourses));
router.get('/courses/:id/edit', catchErrors(courseController.editCourse));

router.get('/add', authController.isLoggedIn, courseController.addCourse);

router.post('/add',
    courseController.upload,
    catchErrors(courseController.resize),
    catchErrors(courseController.compressPng),
    catchErrors(courseController.createCourse)
);
router.post('/add/:id',
    courseController.upload,
    catchErrors(courseController.resize),
    catchErrors(courseController.compressPng),
    catchErrors(courseController.updateCourse)
);

router.get('/tags', catchErrors(courseController.getCourseByTag));
router.get('/tags/:tag', catchErrors(courseController.getCourseByTag));
router.get('/course/:slug', catchErrors(courseController.getCourseBySlug));

router.get('/login', userController.login);
router.get('/logout', authController.logout);
router.get('/popular', catchErrors(courseController.getPopularCourses));

router.get('/likes', authController.isLoggedIn, catchErrors(courseController.getLikes));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(courseController.addReview));
router.get('/api/search', catchErrors(courseController.searchCourses));
router.post('/api/courses/:id/like', catchErrors(courseController.likeCourse));

router.get('/contact', authController.isLoggedIn, userController.contact);
router.post('/contact/send', catchErrors(userController.sendMessage));

router.get('/privacy', userController.privacy);

//logging in using OAUTH
router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
}));

//using Github strategy
router.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/login', }), authController.oauthLogin);
router.get('/auth/github/redirect', passport.authenticate('github', { failureRedirect: '/login', }), authController.oauthLogin);

module.exports = router;