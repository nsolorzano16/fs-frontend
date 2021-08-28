import React, { useEffect, useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';

const API_URL = process.env.REACT_APP_API_URL || '';

export const PostsComponent = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      signal,
    };
    fetch(`${API_URL}/post`, headers)
      .then((resp) => resp.json())
      .then((data) => {
        const { posts } = data;
        setPosts(posts);
      });
  }, []);

  return posts.length > 0 ? (
    posts.map((post) => (
      <div key={post.id}>
        <br />
        <Card>
          <CardHeader
            title={
              <Typography
                variant='h4'
                align='center'
              >{`${post.title.toUpperCase()}`}</Typography>
            }
            subheader={
              <Typography>{`Category: ${post.category.description}`}</Typography>
            }
          />

          <CardContent>
            <Typography variant='body1' component='p' align='justify' paragraph>
              {`${post.description}`}
            </Typography>
          </CardContent>

          <CardActions disableSpacing>
            <Typography variant='caption'>
              {`By: ${post.user.firstName} ${post.user.lastName} `}
              <br />
              {`Created At: ${new Date(post.createdAt)}`}
              <br />
              {`Updated At: ${new Date(post.updatedAt)}`}
            </Typography>
          </CardActions>
        </Card>
        <br />
      </div>
    ))
  ) : (
    <div>
      <h3>No Posts yet...!</h3>
    </div>
  );
};
