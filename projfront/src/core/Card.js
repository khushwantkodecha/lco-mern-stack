import React, { useState, useEffect } from 'react';
import ImageHelper from './helper/ImageHelper';
import { Redirect } from 'react-router-dom';
import { addItemToCart, removeItemFromCart } from './helper/CartHelper';

const Card = ({
  product,
  addToCart = true,
  removeFromCart = false,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);

  const cardTitle = product ? product.name : 'Default Product Name!!!';
  const carddescription = product
    ? product.description
    : 'Default Product Desc!!!';
  const cardPrice = product ? product.price : 'Default Product Price!!!';

  const addToCartHandler = () => {
    addItemToCart(product, () => setRedirect(true));
  };

  const getRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  const showAddToCart = (addToCart) => {
    return (
      addToCart && (
        <button
          onClick={addToCartHandler}
          className='btn btn-block btn-outline-success mt-2 mb-2'
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload);
          }}
          className='btn btn-block btn-outline-success mt-2 mb-2'
        >
          Remove From Cart
        </button>
      )
    );
  };
  return (
    <div className='card text-white bg-dark border border-info '>
      <div className='card-header lead text-center'>{cardTitle}</div>
      <div className='card-body'>
        {getRedirect(redirect)}
        <ImageHelper product={product} />
        <p className='lead bg-success font-weight-normal text-wrap'>
          {carddescription}
        </p>
        <p className='btn btn-success rounded  btn-sm px-4'>${cardPrice}</p>
        <div className='row'>
          <div className='col-12'>{showAddToCart(addToCart)}</div>
          <div className='col-12'>{showRemoveFromCart(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
