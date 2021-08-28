import React, { useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppContext } from '../../context/appContext';
import { types } from '../../types/types';

export const NavBar = () => {
  const history = useHistory();
  const {
    user: { logged, role },
    dispatch,
  } = useContext(AppContext);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: types.logout,
        });
        history.replace('/login');
      }
    });
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
        <div className='container-fluid'>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ml-auto'>
              <li className='nav-item'>
                <NavLink
                  exact
                  activeClassName='active'
                  className='nav-link '
                  to='/'
                >
                  Home
                </NavLink>
              </li>

              {!logged ? (
                <li className='nav-item'>
                  <NavLink
                    exact
                    activeClassName='active'
                    className='nav-link '
                    to='/login'
                  >
                    Login
                  </NavLink>
                </li>
              ) : null}

              {logged && role === 'admin' ? (
                <li className='nav-item'>
                  <NavLink
                    exact
                    activeClassName='active'
                    className='nav-link '
                    to='/users'
                  >
                    Users
                  </NavLink>
                </li>
              ) : null}
              {logged ? (
                <li className='nav-item'>
                  <NavLink
                    exact
                    activeClassName='active'
                    className='nav-link '
                    to='/categories'
                  >
                    Categories
                  </NavLink>
                </li>
              ) : null}
              {logged ? (
                <li className='nav-item'>
                  <NavLink
                    exact
                    activeClassName='active'
                    className='nav-link '
                    to='/posts'
                  >
                    Posts
                  </NavLink>
                </li>
              ) : null}
              {logged ? (
                <li className='nav-item'>
                  <button
                    type='button'
                    className='btn btn-outline-warning'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
