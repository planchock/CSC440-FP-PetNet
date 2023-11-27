import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const signup = () => {
    if (!firstName || !lastName || !username || !password || !confirm) {
      alert("All fields are required.");
      return;
    }

    if (username.length < 6) {
      alert("Username must be at least 6 characters long.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // TODO: API CALL TO CREATION
  };

  return (
    <Header>
      <div className="flex items-center justify-center max-w-5xl mx-auto">
        <div className="flex items-center space-x-40">
          <img src="/cat.webp" height={300} width={450} />
          <div className="block text-black">
            <h1 className="mb-4 text-3xl font-extrabold">Welcome to PetNet</h1>
            <input
              type="text"
              placeholder="First Name"
              className="p-2 mt-4 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 mt-4 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="p-2 mt-4 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 mt-4 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="p-2 mt-4 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg"
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              className="block p-2 mt-4 text-xl font-bold text-white w-[17.25rem] rounded-lg drop-shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800"
              onClick={signup}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Signup;
