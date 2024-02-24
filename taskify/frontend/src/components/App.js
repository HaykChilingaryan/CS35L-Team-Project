import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Profile from "./Profile/Profile";
import Sidebar from "./Sidebar/Sidebar";
import TaskList from "./TaskList/TaskList";
import Login1 from "./Auth/Login";
import TaskPage from "./TaskList/TaskPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleLoginSuccess = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  return (
    <Router>
      {isAuthenticated && <Sidebar username={username} />}
      <Routes>
        <Route
          path="/"
          element={<Login1 onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="profile" element={isAuthenticated && <Profile />} />
        <Route path="tasklist" element={<TaskPage />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("app")).render(<App />);
