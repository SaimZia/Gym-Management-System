// src/components/common/Profile.js
import React from 'react';
import { formatDate, validateEmail, capitalize, generateId, calculateAge } from '../../utils/helpers';

const Profile = ({ user }) => {
  return (
    <div className="profile">
      <h1>{capitalize(user.firstName)} {capitalize(user.lastName)}</h1>
      <p>Email: {validateEmail(user.email) ? user.email : 'Invalid email'}</p>
      <p>Birthdate: {formatDate(user.birthdate)}</p>
      <p>Age: {calculateAge(user.birthdate)}</p>
      <p>ID: {generateId()}</p>
    </div>
  );
};

export default Profile;