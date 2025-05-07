const { signup, signin } = require('../Controllers/AuthController');
const { signupValidation, signinValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/signin', signinValidation, signin);
router.post('/signup', signupValidation, signup);

module.exports = router;