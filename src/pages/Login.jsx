// fix admin
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { useAuth } from '../context/AuthContext';
import '../styles/Login.scss';
import { jwtDecode } from "jwt-decode";
import LoginService from '../services/LoginSystem/LoginService'; 
import ManageDealerService from '../services/ManageDealer/ManageDealerService';
import ManageStaffService from '../services/ManageStaff/ManageStaffService';
import ManageBrandService from '../services/ManageBrand/ManageBrandService';
import ManageStoreService from '../services/ManageStore/ManageStoreService';

const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await LoginService.login(email, password);
      const { token, expiresIn } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expiresIn);

      const decoded = jwtDecode(token);
      const { nameid: userId, role } = decoded;
      console.log('Decoded JWT:', decoded); 

      const displayRole = role
        ? role
            .toLowerCase()
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
        : 'User';
      login(displayRole, email);

      if (role === 'Dealer_staff' || role === 'Dealer_manager') {
        const dealerResponse = await ManageDealerService.GetDealerById(userId);
        const { storeId } = dealerResponse;
        const storeData = await ManageStoreService.getStoreById(storeId);
        const storeName = storeData.storeName;
        const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-');

        localStorage.setItem('dealerInfo', JSON.stringify({
          ...dealerResponse,
          storeName,
          storeSlug
        }));

        navigate(`/store/${storeSlug}/vehicle`);
        toast.success('Login Success!');

      } else if (role === 'EVM_Staff') {
        const staffResponse = await ManageStaffService.GetStaffById(userId);
        const { brandId } = staffResponse;

        const brandData = await ManageBrandService.GetBrandById(brandId);
        const brandName = brandData.brandName;
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');

        localStorage.setItem('staffInfo', JSON.stringify({
          ...staffResponse,
          brandName,
          brandSlug
        }));

        navigate(`/brands/${brandSlug}/brand-vehicles`);
        toast.success('Login Success!');
      } else if (role === 'Admin') {

        const staffResponse = await ManageStaffService.GetStaffById(userId);
        const { brandId } = staffResponse;

        if (brandId === null) {

          const allStaffsResponse = await ManageStaffService.getAllStaffs();
          localStorage.setItem('allStaffs', JSON.stringify(allStaffsResponse));
          localStorage.setItem('staffInfo', JSON.stringify(staffResponse));

          navigate('/admin/account-management');
          toast.success('Login Success! Welcome Admin.');
        } else {
          const brandData = await ManageBrandService.GetBrandById(brandId);
          const brandName = brandData.brandName;
          const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');

          localStorage.setItem('staffInfo', JSON.stringify({
            ...staffResponse,
            brandName,
            brandSlug
          }));

          navigate(`/brands/${brandSlug}/brand-vehicles`);
          toast.success('Login Success!');
        }
      } else {
        throw new Error('Unsupported role.');
      }

    } catch (error) {
      console.error('Error during login:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <span className="floating-shape shape-1"></span>
      <span className="floating-shape shape-2"></span>
      <span className="floating-shape shape-3"></span>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="login-card shadow-lg">
              <Row className="g-0">
                <Col md={5} className="login-info-panel d-none d-md-flex align-items-center">
                  <div className="login-info-panel__content">
                    <Badge bg="light" text="dark" className="login-badge">EV DMS</Badge>
                    <h3 className="login-info-title">Effortless dealership management</h3>
                    <p className="login-info-desc">
                      Streamline operations, keep teams aligned, and stay on top of performance with a unified dashboard.
                    </p>
                    <ul className="login-benefits">
                      <li>Monitor inventory and battery distribution</li>
                      <li>Stay updated with real-time analytics</li>
                      <li>Strengthen customer relationships faster</li>
                    </ul>
                  </div>
                </Col>
                <Col xs={12} md={7}>
                  <div className="login-form-wrapper">
                    <div className="login-form-header">
                      <h2 className="login-title">Sign in to your workspace</h2>
                      <p className="login-subtitle">EV Dealer Management System</p>
                    </div>

                    <Form onSubmit={handleSubmit} className="login-form">
                      {error && <Alert variant="danger" className="login-alert">{error}</Alert>}

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="login-input"
                          placeholder="you@evdealer.com"
                          required
                          disabled={loading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="login-input"
                          placeholder="Enter your password"
                          required
                          disabled={loading}
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-start align-items-center mb-4">
                        <Form.Check
                          type="checkbox"
                          id="rememberMe"
                          label="Remember me"
                          className="remember-checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={loading}
                        />
                      </div>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 login-button"
                        disabled={!email || !password || loading}
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </Button>
                    </Form>

                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;