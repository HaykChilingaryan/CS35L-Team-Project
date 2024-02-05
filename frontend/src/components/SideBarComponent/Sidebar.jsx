import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Offcanvas } from "bootstrap";
import logo from "../AuthComponent/TaskifyLogo.png";
import "./Sidebar.css"


function Sidebar() {
  return (
    <section>
      <button class="btn btn-dark btn-lg rounded-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
        <svg 
          xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>

      <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div class="offcanvas-header">
          <h5 class="fs-3 fw-bold offcanvas-title" id="offcanvasWithBothOptionsLabel">TASKIFY</h5>
          <button type="button" class="btn-close bg-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column">
          <ul><button type="button" className="menu-button fs-5 btn"><i class="bi bi-house-door"></i> Dashboard</button></ul>
          <ul><button type="button" className="menu-button fs-5 btn"><i class="bi bi-person"></i> Profile</button></ul>
          <ul class="mt-auto"><button type="button" className="menu-button fs-5 btn"><i class="bi bi-box-arrow-right"></i> Logout</button></ul>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
