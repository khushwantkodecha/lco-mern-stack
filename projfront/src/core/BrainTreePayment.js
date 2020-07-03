import React, { useState, useEffect } from 'react';
import { loadCart, cartEmpty } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import { getMeToken, processPayment } from './helper/paymentHelper';
import { createOrder } from './helper/orderHelper';
import { isAuthenticated } from '../auth/helper/index';
import DropIn from 'braintree-web-drop-in-react';


const BrainTreePayment = ({products}) => {
    const [info,setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error : '',
        instance: {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getMeToken(userId, token)
        .then(info => {
            console.log(info)
            if(info.error){
                setInfo({...info,error: info.error})
            }
            else{
                const clientToken = info.clientToken
                setInfo({clientToken})
            }
        })
    }

    useEffect(() => {
        getToken(userId, token);
    }, [])

    const onPurchase = () =>{
        setInfo({loading:true});
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
        .then(data => {
            nonce = data.nonce
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            }
            processPayment(userId,token,paymentData)
            .then(res=> 
                {
                    console.log('then')
                    setInfo({...info,success: res.success,loading: false,})
                    console.log('success')
                }
            )
            .catch(err => {
                console.log('catch')
                setInfo({
                    loading: false,
                    success: false,
                    // TODO: empty the cart
                })
                console.log('failed')
            })
        }
        )
        .catch(err=>console.log(err))
    }

    const getAmount = () => {
        let amount = 0;
        products.map(p=> amount = amount + p.price)
        return amount
    }

    const showDropIn = () => {
        return (
            <div>
                {info.clientToken && products.length ? (
                    <div>
                    <DropIn
                      options={{ authorization: info.clientToken }}
                      onInstance={(instance) => (info.instance = instance)}
                    />
                    <button className='btn btn-block btn-success' onClick={onPurchase}>Buy</button>                  </div>
                ) : (
                    <h3>Please login or add some products in cart!!!</h3>
                )}
            </div>
        )
    }

	return (
		<div>
			<h2>Braintree Payment!!!</h2>
            {showDropIn()}
		</div>
	);
};

export default BrainTreePayment;
