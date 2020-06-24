import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/helper';


const currentTab = (history, path) => {
    if(history.location.pathname === path){
        return { color:'#FFFFFF' }
    }
    else{
        return { color: '#d1d1d1' }
    }
}

const Menu = ({ history }) => {
    return (
        <ul className='nav nav-tabs ng-dark'>
            <li className='nav-items'>
                <Link style={currentTab(history, '/')} className='nav-link' to='/'>Home</Link>
            </li>
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className='nav-items'>
                    <Link style={currentTab(history, '/user/dashboard')} className='nav-link' to='/user/dashboard'>User Dashboard</Link>
                </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className='nav-items'>
                    <Link style={currentTab(history, '/user/dashboard')} className='nav-link' to='/admin/dashboard'>Admin Dashboard</Link>
                </li>
            )}
            <li className='nav-items'>
                <Link style={currentTab(history, '/cart')} className='nav-link' to='/cart'>Cart</Link>
            </li>
            {!isAuthenticated() &&
            <Fragment>
                <li className='nav-items'>
                    <Link style={currentTab(history, '/signup')} className='nav-link' to='/signup'>SignUp</Link>
                </li>
                <li className='nav-items'>
                    <Link style={currentTab(history, '/signin')} className='nav-link' to='/signin'>SignIn</Link>
                </li>
            </Fragment>
            }
            {isAuthenticated() && (
                <li className='nav-items'>
                    <span className='nav-link text-warning' onClick={() => { signout(()=> {
                        history.push('/')
                    }) }}>SignOut</span>
            </li>
            )}
        </ul>
    )
}

export default withRouter(Menu);