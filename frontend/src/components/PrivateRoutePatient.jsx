import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// This component will check if the user is logged in
const PrivateRoutePatient = ({ element, ...rest }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  let isAuthenticated = false;
  let isPatient = false;

  if (token) {
    try {
      // Split the token into parts (header, payload, signature)
      const tokenParts = token.split('.');
      
      if (tokenParts.length === 3) {
        // Decode the payload (second part of the JWT)
        const payload = atob(tokenParts[1]);

        // Parse the decoded payload as JSON
        const decodedPayload = JSON.parse(payload);

        // Check if the usertype is 'patient'
        if (decodedPayload.userType === 'patient') {
          isAuthenticated = true;
          isPatient = true;
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // Render the element if authenticated, otherwise redirect to signin
  return isAuthenticated && isPatient ? element : <Navigate to="/signin" />;
};

export default PrivateRoutePatient;
