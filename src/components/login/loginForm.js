import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../context/appContext';
import { types } from '../../types/types';

const API_URL = process.env.REACT_APP_API_URL || '';
export const LoginForm = () => {
  const history = useHistory();
  const { dispatch } = useContext(AppContext);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const { email, password } = formValues;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    };

    const resp = await fetch(`${API_URL}/auth`, requestOptions);
    const data = await resp.json();

    if (resp.status !== 200) {
      Swal.fire('Oops...', `${data.msg}`, 'error');
    } else {
      dispatch({
        type: types.login,
        payload: {
          uid: data.uid,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          token: data.token,
        },
      });

      history.replace('/');
    }
  };
  return (
    <div>
      <br />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title={`LOGIN`}></CardHeader>
          <CardContent>
            <FormControl fullWidth={true} required={true}>
              <InputLabel htmlFor='email'>Email address</InputLabel>
              <Input
                id='email'
                aria-describedby='my-helper-text'
                type='email'
                name='email'
                value={email}
                onChange={handleInputChange}
              />
              <FormHelperText id='my-helper-text'>
                example@example.com
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} required={true}>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input
                id='password'
                type='password'
                name='password'
                value={password}
                onChange={handleInputChange}
              />
            </FormControl>
            <br />
            <br />
            <Button variant='contained' color='primary' type='submit'>
              Login
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
