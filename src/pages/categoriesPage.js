import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Input,
  InputLabel,
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
import Swal from 'sweetalert2';
import { AppContext } from '../context/appContext';
import { NavBar } from '../components/navbar/navbar';

const API_URL = process.env.REACT_APP_API_URL || '';
export const CategoriesPage = () => {
  const { user } = useContext(AppContext);
  const [categoriesList, setCategoriesList] = useState([]);
  const [respDelete, setRespDelete] = useState({});
  const [imEditing, setImEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    description: '',
    id: '',
  });

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
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
        const resp = await fetch(`${API_URL}/category`, requestOptions);
        const { msg } = await resp.json();

        if (resp.status !== 201) {
          showMessage('Error!', msg);
        } else {
          showMessage('Ok', 'Category has been added');
          getCategories();
          resetForm();
          setImEditing(false);
        }
      } else {
        const { id } = formValues;
        const resp = await fetch(`${API_URL}/category/${id}`, requestOptions);

        if (resp.status !== 200) {
          showMessage('Error!', 'Error has occurred contact your admin');
        } else {
          showMessage('Ok', 'Category has been edited');
          getCategories();
          resetForm();
        }
      }
    }
  };

  const isFormValid = () => {
    if (description.trim().length === 0 || description.trim().length < 3) {
      showMessage('Error!', 'Write a valid description');
      return false;
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
      description: '',
      id: '',
    });
  };

  const getCategories = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/category`, requestOptions);
    const { categories } = await resp.json();
    console.log(categories);

    setCategoriesList(categories);
  };

  const { description } = formValues;

  useEffect(() => {
    getCategories();
  }, [respDelete]);

  const handleDeleteCategory = (id) => {
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
        deleteCategory(id);
        Swal.fire('Deleted!', respDelete.msg, 'success');
      }
    });
  };

  const deleteCategory = async (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/category/${id}`, requestOptions);
    const data = await resp.json();
    setRespDelete(data);
  };

  const handleEditCategory = (category) => {
    setFormValues(category);
    setImEditing(true);
  };

  return (
    <div>
      <NavBar />
      <br />
      <div className='row'>
        <div className='col-4'>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                title={imEditing ? 'Edit Category' : 'Add Category'}
              ></CardHeader>
              <CardContent>
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='description'>Description</InputLabel>
                  <Input
                    id='description'
                    aria-describedby='my-helper-text'
                    type='description'
                    name='description'
                    value={description}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />

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
                  <TableCell>Description</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriesList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component='th' scope='row'>
                      {row.description}
                    </TableCell>

                    <TableCell>{`${row.user.firstName} ${row.user.lastName}`}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label='delete'
                        onClick={() => handleDeleteCategory(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label='edit'
                        onClick={() => handleEditCategory(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
