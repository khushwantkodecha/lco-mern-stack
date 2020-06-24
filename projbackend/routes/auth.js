let express = require('express');
let router = express.Router();

let { signup, signin, signout, isSignedIn } = require('../controllers/auth');
const { check } = require('express-validator');

router.post(
	'/signup',
	[
		check('name').isLength({ min: 3 }).withMessage('Name should be of at least 3 character!!!'),
		check('email').isEmail().withMessage('Email should be valid!!!'),
		check('password').isLength({ min: 5 }).withMessage('Password should be at least of 5 character!!!')
	],
	signup
);

router.post(
	'/signin',
	[
		// check('email').isEmail().withMessage('email is required!!!'),
		// check('password').isLength({ min: 1 }).withMessage('password can not be blank!!!')
	],
	signin
);

router.get('/signout', signout);

router.get('/testroute', isSignedIn, (req, res) => {
	res.json(req.auth);
});

module.exports = router;
