import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feed" element={<h1>Feed Placeholder</h1>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
