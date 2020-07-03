import React, { useState, useEffect } from 'react';
import '../styles.css';
// import { API } from '../backend';
import Base from './Base';
import { loadCart } from './helper/CartHelper';
import Card from './Card';
import StripeCheckout from './StripeCheckout';
import BrainTreePayment from './BrainTreePayment';

const Cart = () => {
	const [ products, setProducts ] = useState([]);
	const [ reaload, setreaload ] = useState(false);

	useEffect(
		() => {
			setProducts(loadCart);
		},
		[ reaload ]
	);

	const loadAllProducts = (products) => {
		return (
			<div>
				<h2>This section is for load products!!!</h2>
				{products.map((product, index) => {
					return (
						<Card
							key={index}
							product={product}
							removeFromCart={true}
							addToCart={false}
							setreaload={setreaload}
							reaload={reaload}
						/>
					);
				})}
			</div>
		);
	};

	const loadCheckout = () => {
		return (
			<div>
				<h2>This section is for checkour products!!!</h2>
			</div>
		);
	};
	return (
		<Base title="Cart Page!!!">
			<div className="row text-center">
				{/* <h1 className='text-white'>All of tshirts</h1> */}
				<div className="row">
					<div className="col-6">
						{products.length > 0 ? loadAllProducts(products) : <h3>No Products Here</h3>}
					</div>
					<div className="col-6">
						{/* <StripeCheckout products={products} setReload={setreaload} /> */}
						<BrainTreePayment products={products} setReload={setreaload} />
					</div>
				</div>
			</div>
		</Base>
	);
};

export default Cart;
