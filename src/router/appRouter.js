import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { UsersPage } from '../pages/usersPage';
import { CategoriesPage } from '../pages/categoriesPage';
import { PrivateRoute } from './privateRoute';
import { AppContext } from '../context/appContext';
import { PublicRoute } from './publicRoute';

export const AppRouter = () => {
  const { user } = useContext(AppContext);

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoute
            exact
            path='/login'
            component={LoginPage}
            isAuthenticated={user.logged}
          />
          <PrivateRoute
            exact
            path='/users'
            component={UsersPage}
            isAuthenticated={user.logged}
          />
          <PrivateRoute
            exact
            path='/categories'
            component={CategoriesPage}
            isAuthenticated={user.logged}
          />
          <Route exact path='/' component={HomePage} />
          {/* <Route exact path='/students' component={StudentsPage} />
          <Route exact path='/detail/:id' component={DetailPage} />
          <Route exact path='/edit/:id' component={EditPage} /> */}
          <Redirect to='/' />
        </Switch>
      </div>
    </Router>
  );
};
