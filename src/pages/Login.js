import React, { useContext, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // udpate triggered if mutation successful
    update(_, { data: { login: userData }}){ // destructuring data from result, login from data, aliasing as userData
      context.login(userData);
      props.history.push('/'); // Redirect to the home page
    },
    onError(err) {
      // Note: below code is based on how we set up our server code (e.g. it can vary)
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  })

  // Note: Need to use function keyword to hoist this function and make addUser available to useForm call above;
  // if we had called useForm after useMutation, useMutation would not have access to 'values'
  function loginUserCallback(){
    loginUser();
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label='Username'
          placeholder='Username...'
          name='username'
          type='text'
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label='Password'
          placeholder='Password...'
          name='password'
          type='password'
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type='submit' primary>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
      </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation register(
    $username: String!
    $password: String!
  ) {
    login(username: $username password: $password) {
      id email username createdAt token
    }
  }
`

export default Login;