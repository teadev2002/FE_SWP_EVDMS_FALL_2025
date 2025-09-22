import React from 'react';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/HomePage.scss';

const Sidebar = ({
  menuItems = [
    "Vehicle Catalog",
    "Customers",
    "Sales & Quotes",
    "Products",
    "Orders & Delivery",
    "Test Drives",
    "Reports",
    "Settings"
  ],
  activeItem = "Vehicle Catalog"
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        EV Dealer System
      </div>
      <nav className="nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeItem === item ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              {item}
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;