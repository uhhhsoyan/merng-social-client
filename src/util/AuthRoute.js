import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

// Note: this route will redirect login and register paths to the homepage if user logged in

function AuthRoute({ component: Component, ...rest }){
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => (
        user ? <Redirect to='/'/> : <Component {...props}/>
      )}
    />
  )
}

export default AuthRoute;