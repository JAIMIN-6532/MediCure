import React from 'react';
import { Route, Navigate } from 'react-router-dom';

//it will check if user is logged in
const PrivateRoutePatient = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  let isAuthenticated = false;
  let isPatient = false;

  if (token) {
    try {
      // split the token into parts (header, payload, signature)
      const tokenParts = token.split('.');
      
      if (tokenParts.length === 3) {
        // decode the payload 
        const payload = atob(tokenParts[1]);

        // parse the decoded payload as JSON
        const decodedPayload = JSON.parse(payload);

        // check if the usertype is 'patient'
        if (decodedPayload.userType === 'patient') {
          isAuthenticated = true;
          isPatient = true;
        }
      }
    } catch (error) {
      // console.error('Error decoding token:', error);
    }
  }

  return isAuthenticated && isPatient ? element : <Navigate to="/signin" />;
};

export default PrivateRoutePatient;
