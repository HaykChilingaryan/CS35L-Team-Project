import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import Sidebar from "./Sidebar/Sidebar";
import Login1 from "./Auth/Login";
import TaskPage from "./TaskList/TaskPage";
import Profile from "./Profile/Profile";
const App = () => {
  const session = sessionStorage.getItem("session");
  return (
    <Router>
      {<Sidebar />}
      <Routes>
        <Route path="/" element={<Login1 />} />
        {<Route path="/tasklist" element={<TaskPage />} />}
        {<Route path="/profile" element={<Profile />} />}
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("app")).render(<App />);
