import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { CreateAccountAPI } from '../Endpoints';
import axios from 'axios';
import HomePage from './HomePage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(CreateAccountAPI, {
        username,
        password,
      });
      if (response.status === 200) {
        setSignedIn(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center align-top">
        <h1 className="text-3xl mb-6">Welcome to PetNet!</h1>
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              Username:
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full border p-2 rounded"
              />
            </label>
            <label className="block mb-4">
              Password:
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full border p-2 rounded"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Routes>
        <Route
          path="/home"
          element={<HomePage />}
        />
      </Routes>
    </Router>
  );
};

export default CreateAccount;


