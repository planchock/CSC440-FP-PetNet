import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
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
          <Route path="/post" element={<Post />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/groups" element={<h1>group page</h1>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
