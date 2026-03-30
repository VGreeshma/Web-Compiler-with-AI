import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import './frontpage.css'; 

function FrontPage() {
  const navigate=useNavigate();
  return (
    <>
      <nav 
        className="navbar navbar-expand-lg" 
        style={{ backgroundColor: "#90e0ef", boxShadow: "none" }}
      >
        <div className="container">
          <a className="navbar-brand" href="/" style={{ color: "black",fontWeight:"bold" }}>
            CodeAnywhere
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{ borderColor: "black" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="animated-bg d-flex justify-content-center align-items-center">
        <button className="start-btn" onClick={() => navigate("/123")}>
          Start Building
        </button>
      </div>
    </>
  );
}

export default FrontPage;
