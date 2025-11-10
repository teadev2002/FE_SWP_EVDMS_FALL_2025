// fix admin
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
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
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Vui lòng nhập email và password.');
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
        throw new Error('Role không được hỗ trợ.');
      }

    } catch (error) {
      console.error('Error during login:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMsg);
      toast.error(errorMsg);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="login-icon mb-3">🔐</div>
                  <h2 className="login-title">Login System</h2>
                  <p className="login-subtitle">EV Dealer Management System</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-button"
                    disabled={!email || !password || loading}
                  >
                    {loading ? 'Loging in...' : 'Login'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;