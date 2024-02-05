function Navigation() {
  return (
    <nav className=" navbar fixed-top navbar-expand-lg navbar-dark bg-dark align-items-center">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Taskify
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
      </div>
    </nav>
  );
}

export default Navigation;
