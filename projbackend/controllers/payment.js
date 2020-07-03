const stripe = require('stripe')(
	'sk_test_51GxPKUBa3wE5VddFNeAUTwcatthihEv3AsHDGBJU6E0PNG0VTQmF1vfNQVcwKax5Xxg672iIYxpdCOgefxPQXhO500UigrXYVD'
);
const uuid = require('uuid/v4');
const { result } = require('lodash');

// for braiantree
let braintree = require('braintree');

// here code for stripe payment
exports.makeStripePayment = (req, res) => {
	const { products, token } = req.body;
	console.log('products', products);
	let amount = 0;
	products.map((product) => {
		amount = amount + product.price;
	});

	const idempotencyKey = uuid();

	return stripe.customers
		.create({
			email  : token.email,
			source : token.id
		})
		.then((customer) => {
			stripe.charges.create(
				{
					amount        : amount * 100,
					currency      : 'usd',
					customer      : customer.id,
					receipt_email : token.email,
					shipping      : {
						name    : token.card.name,
						address : {
							line1       : token.card.address_line1,
							line2       : token.card.address_line2,
							city        : token.card.address_city,
							country     : token.card.address_country,
							postal_code : token.card.address_zip
						}
					},
					description   : 'a product description'
				},
				{ idempotencyKey }
			);
		})
		.then((result) => res.status(200).json(result))
		.catch((err) => console.log(err));
};

// below is braintree code
var gateway = braintree.connect({
	environment : braintree.Environment.Sandbox,
	merchantId  : '35f8cjybx6v3mqz7',
	publicKey   : 'st8ff7k6b4srmg6h',
	privateKey  : 'e02a9ab94b1030fa61c32a554e0d0a63'
});

exports.getToken = (req, res) => {
	gateway.clientToken.generate({}, function(err, response) {
		if (err) {
			return res.status(500).send(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = () => {
	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheCLient = req.body.amount;
	gateway.transaction.sale(
		{
			amount             : amountFromTheCLient,
			paymentMethodNonce : nonceFromTheClient,
			options            : {
				submitForSettlement : true
			}
		},
		function(err, result) {
			if (err) {
				return res.status(500).json(err);
			} else {
				res.json(result);
			}
		}
	);
};
