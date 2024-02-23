import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./Auth/Login";
import Profile from "./Profile/Profile";
import Sidebar from "./Sidebar/Sidebar";
import TaskList from "./TaskList/TaskList";
import Login1 from "./Auth/Login1";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={<Login1 onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="profile" element={<Profile />} />
        <Route path="tasklist" element={<TaskList />}/>
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("app")).render(<App />);
