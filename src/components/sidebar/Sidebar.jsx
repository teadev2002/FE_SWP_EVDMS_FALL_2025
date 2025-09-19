import React from 'react';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/HomePage.scss'; // Ensure the same styles are applied

const Sidebar = ({ menuItems = [
  "Vehicle Catalog",
  "Customers",
  "Sales & Quotes",
  "Products",
  "Orders & Delivery",
  "Test Drives",
  "Reports",
  "Settings"
], activeItem = "Products" }) => {
  return (
    <Col md={2} className="sidebar bg-dark text-white p-3">
      <h5 className="mb-4">EV Dealer System</h5>
      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <li key={index} className={`nav-item mb-2 ${activeItem === item ? 'active' : ''}`}>
            <a href="#" className={`nav-link text-white ${activeItem === item ? 'bg-primary' : ''}`}>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default Sidebar;