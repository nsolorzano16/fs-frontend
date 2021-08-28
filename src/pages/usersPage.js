import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import validator from 'validator';
import Swal from 'sweetalert2';
import { AppContext } from '../context/appContext';
import { NavBar } from '../components/navbar/navbar';

const API_URL = process.env.REACT_APP_API_URL || '';
export const UsersPage = () => {
  const { user } = useContext(AppContext);
  const [usersList, setUsersList] = useState([]);
  const [respDelete, setRespDelete] = useState({});
  const [imEditing, setImEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'editor',
    id: '',
  });

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const handleRoleChange = ({ target }) => {
    setFormValues({
      ...formValues,
      role: target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid()) {
      const requestOptions = {
        method: !imEditing ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-token': `${user.token}`,
        },
        body: JSON.stringify(formValues),
      };

      if (!imEditing) {
        const resp = await fetch(`${API_URL}/auth/new`, requestOptions);
        const { msg } = await resp.json();

        if (resp.status !== 201) {
          showMessage('Error!', msg);
        } else {
          showMessage('Ok', 'User has been added');
          getUsers();
          resetForm();
          setImEditing(false);
        }
      } else {
        const { id } = formValues;
        const resp = await fetch(`${API_URL}/auth/${id}`, requestOptions);

        if (resp.status !== 200) {
          showMessage('Error!', 'Error has occurred contact your admin');
        } else {
          showMessage('Ok', 'User has been edited');
          getUsers();
          resetForm();
        }
      }
    }
  };

  const isFormValid = () => {
    if (firstName.trim().length === 0 || firstName.trim().length < 3) {
      showMessage('Error!', 'Write a valid name');
      return false;
    } else if (lastName.trim().length === 0 || lastName.trim().length < 3) {
      showMessage('Error!', 'Write a valid Last name');
      return false;
    } else if (!validator.isEmail(email)) {
      showMessage('Error!', 'email is not valid');
      return false;
    } else if (password.length < 6) {
      showMessage('Error!', 'password must be at least 6 characters');
      return false;
    } else if (role.trim().length === 0) {
      showMessage('Error!', 'select role');
    }

    return true;
  };

  const showMessage = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      timer: 2000,
      position: 'bottom-right',
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  };

  const resetForm = () => {
    setFormValues({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      id: '',
    });
  };

  const getUsers = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/auth`, requestOptions);
    const { users } = await resp.json();

    setUsersList(users);
  };

  const { firstName, lastName, email, role, password } = formValues;

  useEffect(() => {
    getUsers();
  }, [respDelete]);

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire('Deleted!', respDelete.msg, 'success');
      }
    });
  };

  const deleteUser = async (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/auth/${id}`, requestOptions);
    const data = await resp.json();
    setRespDelete(data);
  };

  const handleEditUser = (user) => {
    setFormValues(user);
    setImEditing(true);
  };

  return (
    <div>
      <NavBar />
      <div className='row'>
        <div className='col-4'>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                title={imEditing ? 'Edit User' : 'Add User '}
              ></CardHeader>
              <CardContent>
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='firstName'>First Name</InputLabel>
                  <Input
                    id='firstName'
                    aria-describedby='my-helper-text'
                    type='firstName'
                    name='firstName'
                    value={firstName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                  <Input
                    id='lastName'
                    aria-describedby='my-helper-text'
                    type='lastName'
                    name='lastName'
                    value={lastName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='email'>Email</InputLabel>
                  <Input
                    id='email'
                    aria-describedby='my-helper-text'
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='password'>Password</InputLabel>
                  <Input
                    type='password'
                    id='password'
                    aria-describedby='my-helper-text'
                    name='password'
                    value={password}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth={true} required={true}>
                  <InputLabel id='role'>Role</InputLabel>
                  <Select
                    labelId='role'
                    id='role'
                    value={role}
                    onChange={handleRoleChange}
                  >
                    <MenuItem value={'admin'}>Admin</MenuItem>
                    <MenuItem value={'editor'}>Editor</MenuItem>
                  </Select>
                </FormControl>
                <br />
                <br />
                &nbsp;
                <Button variant='contained' color='primary' type='submit'>
                  {imEditing ? 'Edit' : 'Save'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
        <div className='col-8'>
          <TableContainer>
            <Table aria-label='users table'>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList.length === 0 ? (
                  <TableRow>
                    <TableCell>No data</TableCell>
                    <TableCell>No data</TableCell>
                    <TableCell>No data</TableCell>
                    <TableCell>No data</TableCell>
                    <TableCell>No data</TableCell>
                  </TableRow>
                ) : (
                  usersList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component='th' scope='row'>
                        {row.firstName}
                      </TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label='delete'
                          onClick={() => handleDeleteUser(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          aria-label='edit'
                          onClick={() => handleEditUser(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
