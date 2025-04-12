import React from 'react';
import { Route, Navigate } from 'react-router-dom';

//it will check if user is logged in
const PrivateRouteAdmin = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      // split the token into parts (header, payload, signature)
      const tokenParts = token.split('.');
      
      if (tokenParts.length === 3) {
        // decode the payload 
        const payload = atob(tokenParts[1]);

        // parse the decoded payload as JSON
        const decodedPayload = JSON.parse(payload);

        // check if the usertype is 'admin'
        if (decodedPayload.userType === 'admin') {
          isAuthenticated = true;
          isAdmin = true;
        }
      }
    } catch (error) {
      // console.error('Error decoding token:', error);
    }
  }

  return isAuthenticated && isAdmin ? element : <Navigate to="/admin/login" />;
};

export default PrivateRouteAdmin;
