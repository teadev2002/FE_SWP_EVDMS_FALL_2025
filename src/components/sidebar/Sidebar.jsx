// import React from 'react';
// import { Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/HomePage.scss';

// const Sidebar = ({
//   menuItems = [
//     "Vehicle Catalog",
//     "Customers",
//     "Sales & Quotes",
//     "Products",
//     "Orders & Delivery",
//     "Test Drives",
//     "Reports",
//     "Settings"
//   ],
//   activeItem = "Vehicle Catalog"
// }) => {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-title">
//         EV Dealer System
//       </div>
//       <nav className="nav">
//         {menuItems.map((item, index) => (
//           <div key={index} className="nav-item">
//             <a
//               href="#"
//               className={`nav-link ${activeItem === item ? 'active' : ''}`}
//               onClick={(e) => e.preventDefault()}
//             >
//               {item}
//             </a>
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/sidebar/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/HomePage.scss';

const Sidebar = ({
  menuItems = [
    "Products",
    "Test Drives"
  ],
  activeItem = "Products"
}) => {
  const location = useLocation();

  // Map menu items to paths for routing
  const menuConfig = [
    { name: "Products", path: "/" },
    { name: "Test Drive History", path: "/test-drives" } // Now points to history page
  ];

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const matchedItem = menuConfig.find(item => item.path === currentPath);
    return matchedItem ? matchedItem.name : activeItem;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        EV Dealer System
      </div>
      <nav className="nav">
        {menuConfig.map((item, index) => {
          const isActive = getActiveItem() === item.name;
          return (
            <div key={index} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;