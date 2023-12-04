import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import AuthProvider from "./components/AuthProvider";
import Groups from "./pages/Groups";
import Group from "./pages/Group";

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
            <Route path="/groups" element={<Groups />} />
            <Route path="/group" element={<Group />} />
            <Route path="/profile" element={<h1>profile page</h1>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
