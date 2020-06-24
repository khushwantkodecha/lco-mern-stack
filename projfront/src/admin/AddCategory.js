import React, { useState } from 'react'
import Base from '../core/Base';
import { isAuthenticated } from '../auth/helper';
import { Link } from 'react-router-dom';
import { createCategory } from './helper/adminapicall';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAuthenticated();

    const myCategoryForm = () => (
        <form>
            <div className='form-group'>
                <p className='lead'>Enter the category</p>
                <input className='form-control my-3' placeholder='For Ex. Summer' onChange={handleChange} value={name} autoFocus required></input>
                <button className='btn btn-lg btn-outline-info' onClick={onSubmit}>Create Category</button>
            </div>
        </form>
    )

    const goBack = () => (
        <div className='mt-5'>
            <Link className='btn btn-sm btn-success mb-3' to='/admin/dashboard'>Admin Home</Link>
        </div>
    )

    const handleChange = (event) => {
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setSuccess(false);
        createCategory(user._id, token, { name })
        .then(data=>{
            if(data.error){
                setError(true);
            }
            else{
                setError(false);
                setSuccess(true)
                setName('');
            }
        })
    }

    const successMessage = () => {
        if(success){
            return <div className='text-danger'>Category Created!!!</div>
        }
    }

    const warningMessage = () => {
        if(error){
            return <div className='text-white'>Failed to create category!!!</div>
        }
    }
    return (
        <Base title='Create a category here' description='add a new category for tshirt' className='container bg-info p-4'>
            <div className='row bg-white rounded'>
                <div className='col-md-8 offset-md-2'>
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;