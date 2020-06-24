import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth/helper';
import { loadCart, cartEmpty } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backend';

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload: undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: '',
    address: '',
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products &&
      products.length &&
      products.map((product) => {
        amount = amount + product.price;
      });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      'Content-type': 'application/json',
    };

    return fetch(`${API}/stripepayment`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
      .then((res) => {
        console.log(res);
        const { status } = res;
        cartEmpty();
      })
      .catch((err) => console.log(err));
  };
  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey='pk_test_51GxPKUBa3wE5VddFt4mqMXz1IfW0hC4hSn5aFptxzxUYsrk8BFYBFHhbbZIGAxIMNnUBgaLOkZUJGVG5sKA0hLKj00sUSbiPz5'
        token={makePayment}
        amount={getFinalPrice() * 100}
        name='Buy Tshirt'
        shippingAddress
        billingAddress
      >
        <button className='btn btn-success'>Pay with Stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to='/signin'>
        <button className='btn btn-warning'>SignIn</button>
      </Link>
    );
  };
  return (
    <div>
      <h1 className='text-white'>Stripe {getFinalPrice()} </h1>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
