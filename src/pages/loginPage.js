import React from 'react';
import { NavBar } from '../components/navbar/navbar';
import { LoginForm } from '../components/login/loginForm';

export const LoginPage = () => {
  return (
    <div>
      <NavBar />
      <div className='row'>
        <div className='col-4'></div>
        <div className='col-4'>
          <LoginForm />
        </div>
        <div className='col-4'></div>
      </div>
    </div>
  );
};
