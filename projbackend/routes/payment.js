const express = require('express');
const router = express.Router();
const { makeStripePayment,getToken,processPayment } = require('../controllers/payment');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');

// stripe payment
router.post('/stripepayment', makeStripePayment);

// braintree payment
router.get('/payment/gettoken/:userId', getToken);
router.post('/payment/braintree/:userId',isSignedIn,isAuthenticated,processPayment)

module.exports = router;
