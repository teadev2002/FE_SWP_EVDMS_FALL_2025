import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Briefcase } from 'lucide-react';
import '../styles/Footer.scss';
import TestDriveService from '../services/TestDriveService/TestDriveService';

const Footer = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await TestDriveService.getAllStores();
        setStores(data);
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleBusinessPortal = () => {
    navigate('/login');
  };

  return (
    <footer className="app-footer">
      <Container>
        <Row className="footer-content">
          {/* Store Information */}
          <Col md={6} lg={4} className="mb-4">
            <h5 className="footer-title">Showroom Locations</h5>
            {loading ? (
              <p className="text-muted">Loading stores...</p>
            ) : stores.length > 0 ? (
              <div className="stores-list">
                {stores.slice(0, 3).map((store) => (
                  <div key={store.storeId} className="store-item mb-3">
                    <h6 className="store-name">{store.storeName}</h6>
                    <div className="store-detail">
                      <MapPin size={16} className="me-2" />
                      <span>{store.address}</span>
                    </div>
                    {store.phone && (
                      <div className="store-detail">
                        <Phone size={16} className="me-2" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                    {store.email && (
                      <div className="store-detail">
                        <Mail size={16} className="me-2" />
                        <span>{store.email}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No stores available</p>
            )}
          </Col>

          {/* Quick Links */}
          <Col md={6} lg={4} className="mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Vehicle Catalog</a></li>
              <li><a href="/test-drive-register">Schedule Test Drive</a></li>
              <li><a href="/quote-register">Request a Quote</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </Col>

          {/* Business Portal */}
          <Col md={12} lg={4} className="mb-4">
            <h5 className="footer-title">Business Portal</h5>
            <p className="footer-description">
              Are you a dealer, distributor, or staff member? Access our business management platform.
            </p>
            <Button
              variant="outline-light"
              size="lg"
              className="business-portal-btn"
              onClick={handleBusinessPortal}
            >
              <Briefcase size={20} className="me-2" />
              For Businesses →
            </Button>
            {/* <p className="mt-3 text-muted small">
              For business inquiries and partnerships
            </p> */}
          </Col>
        </Row>

        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} EV Dealer Management System. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

