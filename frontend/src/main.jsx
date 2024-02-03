import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import ""
import Navigation from "./components/NavbarComponent/Navbar.jsx";
import Login from "./components/AuthComponent/Login.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Navigation />
    <Login />
  </React.StrictMode>
);
