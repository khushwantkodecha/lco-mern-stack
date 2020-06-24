import React, {useState} from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import {signup} from '../auth/helper/index'

const Signup = () => {

    const [ values, setValues ] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, error, success } = values;

    const handleChange = name => event => {
        setValues({
            ...values,
            error: false,
            [name] : event.target.value
        })
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({
            ...values,
            error:false
        });
        signup({name,email,password})
        .then(data => {
            if(data.error){
                setValues({
                    ...values,
                    error:data.error,
                    success:false
                })
            }else{
                setValues({
                    ...values,
                    name: '',
                    email:'',
                    error: '',
                    success: true
                })
            }
        })
        .catch(console.log('error in signup!!!'))
    }

    const signUpForm = () => {
        return (
            <div className='row'>
                <div className='col-md-6 offset-sm-3 text-left'>
                    <form>
                        <div className='form-group'>
                            <label className='text-light'>Name</label>
                            <input className='form-control' type='text' onChange={handleChange('name')} value={name} />
                        </div>
                        <div className='form-group'>
                            <label className='text-light'>Email</label>
                            <input className='form-control' type='text' onChange={handleChange('email')} value={email} />
                        </div>
                        <div className='form-group'>
                            <label className='text-light'>Password</label>
                            <input className='form-control' type='password' onChange={handleChange('password')} value={password} />
                        </div>
                        <button className='btn btn-success btn-block' onClick={onSubmit}>Sign Up</button>
                    </form>
                </div>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div className='row'>
                <div className='col-md-6 offset-sm-3 text-left'>
                    <div className='alert alert-success' style={{display:success? '' : 'none'}}>
                        New account is created. You can <Link to='/signin'>sign in</Link> here!!!
                    </div>
                </div>
            </div>
        )
    }


    const errorMessage = () => {
        return (
            <div className='row'>
                <div className='col-md-6 offset-sm-3 text-left'>
                    <div className='alert alert-danger' style={{ display:error? '' : 'none' }}>
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    console.log(values)
    return (
        <Base title='Sign up page' description='sign up description'>
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
        </Base>
    )
}

export default Signup;