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
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Swal from 'sweetalert2';
import { AppContext } from '../context/appContext';
import { NavBar } from '../components/navbar/navbar';

const API_URL = process.env.REACT_APP_API_URL || '';
export const PostsPage = () => {
  const { user } = useContext(AppContext);
  const [posts, setPostsList] = useState([]);
  const [respDelete, setRespDelete] = useState({});
  const [imEditing, setImEditing] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    category: '',
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
        const resp = await fetch(`${API_URL}/post`, requestOptions);
        const { msg } = await resp.json();

        if (resp.status !== 201) {
          showMessage('Error!', msg);
        } else {
          showMessage('Ok', 'Post has been added');
          getPosts();
          resetForm();
          setImEditing(false);
        }
      } else {
        const { id } = formValues;
        const resp = await fetch(`${API_URL}/post/${id}`, requestOptions);

        if (resp.status !== 200) {
          showMessage('Error!', 'Error has occurred contact your admin');
        } else {
          showMessage('Ok', 'Post has been edited');
          getPosts();
          resetForm();
        }
      }
    }
  };

  const isFormValid = () => {
    if (title.trim().length === 0 || title.trim().length < 3) {
      showMessage('Error!', 'Write a valid title');
      return false;
    } else if (category.trim().length === 0) {
      showMessage('Error!', 'Select a valid category');
      return false;
    } else if (
      description.trim().length === 0 ||
      description.trim().length < 50
    ) {
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
      title: '',
      description: '',
      category: '',
      id: '',
    });
  };

  const getPosts = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/post`, requestOptions);
    const { posts } = await resp.json();

    setPostsList(posts);
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

    setCategories(categories);
  };

  const { title, description, category } = formValues;

  useEffect(() => {
    getPosts();
  }, [respDelete]);

  useEffect(() => {
    getCategories();
  }, []);

  const handleDeletePost = (id) => {
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
        deletePost(id);
        Swal.fire('Deleted!', respDelete.msg, 'success');
      }
    });
  };

  const deletePost = async (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${user.token}`,
      },
    };
    const resp = await fetch(`${API_URL}/post/${id}`, requestOptions);
    const data = await resp.json();
    setRespDelete(data);
  };

  const handleEditPost = ({ id, title, description, category: { _id } }) => {
    setFormValues({
      id,
      title,
      description,
      category: _id,
    });
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
                title={imEditing ? 'Edit Post' : 'Add Post'}
              ></CardHeader>
              <CardContent>
                <FormControl fullWidth={true} required={true}>
                  <InputLabel htmlFor='description'>title</InputLabel>
                  <Input
                    id='title'
                    aria-describedby='my-helper-text'
                    type='text'
                    name='title'
                    value={title}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth={true} required={true}>
                  <InputLabel id='category'>Category</InputLabel>
                  <Select
                    labelId='category'
                    id='category'
                    value={category}
                    onChange={handleInputChange}
                    name='category'
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <br />
                <br />
                <TextField
                  id='description'
                  label='Description'
                  required={true}
                  type='text'
                  name='description'
                  value={description}
                  onChange={handleInputChange}
                  multiline
                  rows={7}
                  fullWidth
                  helperText='min 50 characters.'
                />
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
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component='th' scope='row'>
                      {row.title}
                    </TableCell>
                    <TableCell>{`${row.category.description}`}</TableCell>
                    <TableCell>{`${row.user.firstName} ${row.user.lastName}`}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label='delete'
                        onClick={() => handleDeletePost(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label='edit'
                        onClick={() => handleEditPost(row)}
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
