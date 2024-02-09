import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/NavbarComponent/Navbar.jsx";
import Login from "./components/AuthComponent/Login.jsx";
import Sidebar from "./components/SideBarComponent/Sidebar.jsx";
import TaskList from "./components/TaskListComponent/TaskList.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Login />
    {/* <TaskList /> */}
  </React.StrictMode>
);
