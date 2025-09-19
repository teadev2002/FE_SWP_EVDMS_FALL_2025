import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/HomePage.scss';
import Sidebar from '../../../components/sidebar/Sidebar'; // Import the Sidebar component

const HomePage = () => {
  return (
    <div className="min-h-screen bg-light">
      <Container fluid className="container-fluid">
        <Row>
          {/* Sidebar */}
          <Sidebar   menuItems={[
    'Vehicle Catalog',
    'Customers',
    'Sales & Quotes',
    'Products',
    'Orders & Delivery',
    'Test Drives',
    'Reports',
    'Settings'
  ]}
  activeItem="Products" />

          {/* Main Content */}
          <Col md={10} className="p-4">
            <div className="main-content">
              <div className="search-bar mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search vehicles, customers, or orders..."
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">Electric Vehicle Catalog</h1>
              <p className="text-muted mb-4">
                Browse and manage your EV inventory with detailed specifications and pricing
              </p>
              <div className="filter-bar mb-4 d-flex justify-content-between">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="Search vehicles..."
                />
                <div>
                  <select className="form-select me-2">
                    <option>All Categories</option>
                  </select>
                  <select className="form-select">
                    <option>All Status</option>
                  </select>
                </div>
              </div>
              <Row>
                <Col md={4} className="mb-4">
                  <Card className="vehicle-card">
                    <Card.Img
                      variant="top"
                      src="https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp"
                    />
                    <Card.Body>
                      <div className="stock-badge">5 Available</div>
                      <Card.Title>Tesla Model S</Card.Title>
                      <Card.Text>
                        Range: 405 miles<br />
                        0-60 mph: 3.1s<br />
                        Category: Luxury Sedan
                      </Card.Text>
                      <Card.Text className="price">$89,900</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" size="sm">Details</Button>
                        <Button variant="outline-secondary" size="sm">Compare</Button>
                        <Button variant="primary" size="sm">Quote</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-4">
                  <Card className="vehicle-card">
                    <Card.Img
                      variant="top"
                      src="https://s1.cdn.autoevolution.com/images/gallery/vinfast-vf-9-2022-7300_1.jpg"
                    />
                    <Card.Body>
                      <div className="stock-badge">3 Available</div>
                      <Card.Title>BMW iX</Card.Title>
                      <Card.Text>
                        Range: 324 miles<br />
                        0-60 mph: 4.6s<br />
                        Category: Luxury SUV
                      </Card.Text>
                      <Card.Text className="price">$83,200</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" size="sm">Details</Button>
                        <Button variant="outline-secondary" size="sm">Compare</Button>
                        <Button variant="primary" size="sm">Quote</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-4">
                  <Card className="vehicle-card">
                    <Card.Img
                      variant="top"
                      src="https://tse3.mm.bing.net/th/id/OIP.8tjx039IiQN9y342QEvYHAHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3"
                    />
                    <Card.Body>
                      <div className="stock-badge limited">1 Available</div>
                      <Card.Title>Audi e-tron GT</Card.Title>
                      <Card.Text>
                        Range: 238 miles<br />
                        0-60 mph: 3.9s<br />
                        Category: Sports Car
                      </Card.Text>
                      <Card.Text className="price">$102,400</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" size="sm">Details</Button>
                        <Button variant="outline-secondary" size="sm">Compare</Button>
                        <Button variant="primary" size="sm">Quote</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;