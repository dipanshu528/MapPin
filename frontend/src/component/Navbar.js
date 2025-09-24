
import React, { useState,useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Optional if you want to extract styles

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signup');
  };

  const handleAddPoint = () => {
    setShowAlert(true);
    navigate('/?mode=add');
    console.log("handle add point in navbar")
    setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
  };

  return (
<>
      {/* Alert */}
      {showAlert && (
        <div
          className="alert alert-primary text-center position-fixed w-100"
          style={{ top: '60px', zIndex: 2000 }}
          role="alert"
        >
          Now you can add point
        </div>
      )}


    <nav
      className="navbar navbar-expand-lg navbar-light custom-navbar"
      // style={{
      //   background: 'transparent',
      //   position: 'absolute',
      //   top: 0,
      //   width: '100%',
      //   zIndex: 1000,
      //   padding: '15px 30px',
      // }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', fontSize: '26px', color: '#007bff' }}>
          MapPin
        </Link>

        <div>
          {localStorage.getItem('token') ? (
            <>
              <button className="btn btn-outline-primary me-2" onClick={handleAddPoint}  >
                Add Point
              </button>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>


    </>
  );
};

export default Navbar;




