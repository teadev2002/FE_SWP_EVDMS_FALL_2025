import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import '../../../styles/HomePage.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import VehicleCard from './VehicleCard';

const HomePage = () => {
  const vehicles = [
    {
      id: 1,
      image: 'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
      title: 'Tesla Model S',
      specs: {
        range: '405 miles',
        acceleration: '3.1s',
        category: 'Luxury Sedan'
      },
      price: '$89,900',
      stock: '5 Available',
      stockType: 'available'
    },
    {
      id: 2,
      image: 'https://s1.cdn.autoevolution.com/images/gallery/vinfast-vf-9-2022-7300_1.jpg',
      title: 'BMW iX',
      specs: {
        range: '324 miles',
        acceleration: '4.6s',
        category: 'Luxury SUV'
      },
      price: '$83,200',
      stock: '3 Available',
      stockType: 'available'
    },
    {
      id: 3,
      image: 'https://tse3.mm.bing.net/th/id/OIP.8tjx039IiQN9y342QEvYHAHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
      title: 'Audi e-tron GT',
      specs: {
        range: '238 miles',
        acceleration: '3.9s',
        category: 'Sports Car'
      },
      price: '$102,400',
      stock: '1 Available',
      stockType: 'limited'
    }
  ];

  return (
    <div className="min-h-screen eco-bg">
      <Container fluid className="eco-container">
        <Row className="g-0">
          {/* Sidebar */}
          <Col md={2} className="p-0">
            <Sidebar
              menuItems={[
                'Vehicle Catalog',
                'Customers',
                'Sales & Quotes',
                'Products',
                'Orders & Delivery',
                'Test Drives',
                'Reports',
                'Settings'
              ]}
              activeItem="Vehicle Catalog"
            />
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-4">
            <div className="main-content">
              <SearchBar placeholder="Search vehicles, customers, or orders..." />
              <div className="page-header">
                <h1 className="eco-title">Electric Vehicle Rental Catalog</h1>
                <p className="eco-subtitle">
                  Browse and manage your eco-friendly EV rental inventory with detailed specifications and pricing
                </p>
              </div>
              <FilterBar />

              {/* Vehicle Grid - Fixed layout */}
              <Row className="vehicle-grid g-3">
                {vehicles.map((vehicle) => (
                  <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
                    <VehicleCard vehicle={vehicle} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;