import React from 'react';
import { NavBar } from '../components/navbar/navbar';
import { PostsComponent } from '../components/posts/postsComponent';
export const HomePage = () => {
  return (
    <div>
      <NavBar />
      <br />
      <div className='row'>
        <div className='col-2'></div>
        <div className='col-8'>
          <PostsComponent />
        </div>
        <div className='col-2'></div>
      </div>
    </div>
  );
};
