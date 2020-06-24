const stripe = require('stripe')(
  'sk_test_51GxPKUBa3wE5VddFNeAUTwcatthihEv3AsHDGBJU6E0PNG0VTQmF1vfNQVcwKax5Xxg672iIYxpdCOgefxPQXhO500UigrXYVD'
);
const uuid = require('uuid/v4');
const { result } = require('lodash');

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log('products', products);
  let amount = 0;
  products.map((product) => {
    amount = amount + product.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: amount * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
          description: 'a product description',
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
};
