import React, { useEffect, useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
const API_URL = process.env.REACT_APP_API_URL || '';

export const PostsComponent = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const resp = await fetch(`${API_URL}/post`, headers);
    const { posts } = await resp.json();

    setPosts(posts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return posts.map((post) => (
    <div key={post.id}>
      <Card>
        <CardHeader
          title={post.title.toUpperCase()}
          subheader={
            <div>
              {`Created by: ${post.user.firstName} ${post.user.lastName} `}
              <br />
              {`Created At: ${new Date(post.createdAt).toUTCString()}`}
            </div>
          }
        />

        <CardContent>
          <Typography variant='body2' component='p'>
            {`${post.description}`}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label='edit'>
            <EditIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  ));
};
