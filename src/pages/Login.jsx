// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import '../styles/Login.scss';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (username && password) {
//       login('User', username);
//       navigate('/');
//     }
//   };

//   return (
//     <div className="login-page">
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6} lg={5} xl={4}>
//             <Card className="login-card shadow-lg">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="login-icon mb-3">🔐</div>
//                   <h2 className="login-title">Login System</h2>
//                   <p className="login-subtitle">EV Dealer Management System</p>
//                 </div>

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Username</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="login-input"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="login-input"
//                       required
//                     />
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     type="submit"
//                     className="w-100 login-button"
//                     disabled={!username || !password}
//                   >
//                     Login
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-3">
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login;

//------------------------------------------------------------------------------//
// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Để show error/success (nếu chưa import, add vào)
// import { useAuth } from '../context/AuthContext';
// import '../styles/Login.scss';
// import { jwtDecode } from "jwt-decode";
// import LoginService from '../services/LoginSystem/LoginService'; // Import service từ trước (giả sử path đúng)
// import ManageDealerService from '../services/ManageDealer/ManageDealerService';
// import ManageStaffService from '../services/ManageStaff/ManageStaffService';
// import ManageBrandService from '../services/ManageBrand/ManageBrandService';
// import ManageStoreService from '../services/ManageStore/ManageStoreService';

// const Login = () => {
//   const [email, setEmail] = useState(''); // Đổi từ username thành email
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // Thêm loading state
//   const [error, setError] = useState(''); // Để show error tạm thời
//   const { login } = useAuth(); // Giả sử login() set token vào context
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     if (!email || !password) {
//       setError('Vui lòng nhập email và password.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Gọi API login
//       const response = await LoginService.login(email, password);
//       const { token, expiresIn } = response;

//       // Lưu token vào localStorage (và có thể refresh token logic sau)
//       localStorage.setItem('token', token);
//       localStorage.setItem('expiresIn', expiresIn);

//       // Decode JWT để lấy info
//       const decoded = jwtDecode(token);
//       const { nameid: userId, role } = decoded;
//       console.log('Decoded JWT:', decoded); // Để debug, xóa sau

//       // Gọi AuthContext để sync (nếu cần set user basic)
//       login('User', email); // Giữ nguyên call cũ nếu nó cần, hoặc modify AuthContext để nhận token

//       // Phân role và xử lý
//       if (role === 'Dealer_staff' || role === 'Dealer_manager') {
//         // Gọi API GetDealerById
//         const dealerResponse = await ManageDealerService.GetDealerById(userId);
//         const { storeId, ...dealerInfo } = dealerResponse;
//         console.log('Dealer Info:', dealerInfo); // Để debug, xóa sau
//         // Lưu toàn bộ response vào localStorage
//         localStorage.setItem('dealerInfo', JSON.stringify(dealerResponse));
        
//         // Navigate đến /store/:storeId
//         navigate(`/store/${storeId}/vehicle`);
//         toast.success('Login Success! Chào mừng đến với Store Dashboard.');
        
//       } else if (role === 'EVM_Staff') {
//         // Gọi API GetStaffById
//         const staffResponse = await ManageStaffService.GetStaffById(userId);
//         const { brandId, ...staffInfo } = staffResponse;
//         console.log('Staff Info:', staffInfo); // Để debug, xóa sau
//         // Lưu toàn bộ response vào localStorage
//         localStorage.setItem('staffInfo', JSON.stringify(staffResponse));
        
//         // Navigate đến /brands/:brandId
//         navigate(`/brands/${brandId}/brand-vehicles`);
//         toast.success('Đăng nhập thành công! Chào mừng đến với Brands Dashboard.');
        
//       } else if (role === 'Admin') {
//         // Chỉ navigate, không gọi API thêm
//         navigate('/admin');
//         toast.success('Đăng nhập thành công! Chào mừng Admin.');
        
//       } else {
//         // Role không hợp lệ
//         throw new Error('Role không được hỗ trợ.');
//       }

//     } catch (error) {
//       console.error('Error during login:', error);
//       const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
//       setError(errorMsg);
//       toast.error(errorMsg);
//       // Xóa token nếu có lỗi
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6} lg={5} xl={4}>
//             <Card className="login-card shadow-lg">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="login-icon mb-3">🔐</div>
//                   <h2 className="login-title">Login System</h2>
//                   <p className="login-subtitle">EV Dealer Management System</p>
//                 </div>

//                 <Form onSubmit={handleSubmit}>
//                   {error && <Alert variant="danger">{error}</Alert>}

//                   <Form.Group className="mb-3">
//                     <Form.Label>Email</Form.Label> {/* Đổi label */}
//                     <Form.Control
//                       type="email" // Đổi thành email type
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="login-input"
//                       required
//                       disabled={loading}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="login-input"
//                       required
//                       disabled={loading}
//                     />
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     type="submit"
//                     className="w-100 login-button"
//                     disabled={!email || !password || loading}
//                   >
//                     {loading ? 'Đang đăng nhập...' : 'Login'}
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-3">
//                   {/* Có thể add forgot password sau */}
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login;

// update using slug
// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Để show error/success (nếu chưa import, add vào)
// import { useAuth } from '../context/AuthContext';
// import '../styles/Login.scss';
// import { jwtDecode } from "jwt-decode";
// import LoginService from '../services/LoginSystem/LoginService'; // Import service từ trước (giả sử path đúng)
// import ManageDealerService from '../services/ManageDealer/ManageDealerService';
// import ManageStaffService from '../services/ManageStaff/ManageStaffService';
// import ManageBrandService from '../services/ManageBrand/ManageBrandService';
// import ManageStoreService from '../services/ManageStore/ManageStoreService';

// const Login = () => {
//   const [email, setEmail] = useState(''); // Đổi từ username thành email
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // Thêm loading state
//   const [error, setError] = useState(''); // Để show error tạm thời
//   const { login } = useAuth(); // Giả sử login() set token vào context
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     if (!email || !password) {
//       setError('Vui lòng nhập email và password.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Gọi API login
//       const response = await LoginService.login(email, password);
//       const { token, expiresIn } = response;

//       // Lưu token vào localStorage (và có thể refresh token logic sau)
//       localStorage.setItem('token', token);
//       localStorage.setItem('expiresIn', expiresIn);

//       // Decode JWT để lấy info
//       const decoded = jwtDecode(token);
//       const { nameid: userId, role } = decoded;
//       console.log('Decoded JWT:', decoded); // Để debug, xóa sau

//       // Gọi AuthContext để sync (nếu cần set user basic)
//       login('User', email); // Giữ nguyên call cũ nếu nó cần, hoặc modify AuthContext để nhận token

//       // Phân role và xử lý
//       if (role === 'Dealer_staff' || role === 'Dealer_manager') {
//         const dealerResponse = await ManageDealerService.GetDealerById(userId);
//         const { storeId } = dealerResponse;

//         // GỌI API LẤY STORE NAME
//         const storeData = await ManageStoreService.getStoreById(storeId);
//         const storeName = storeData.storeName;
//         const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-');

//         // Lưu cả ID + Name + Slug
//         localStorage.setItem('dealerInfo', JSON.stringify({
//           ...dealerResponse,
//           storeName,
//           storeSlug
//         }));

//         navigate(`/store/${storeSlug}/vehicle`);
//         toast.success('Đăng nhập thành công!');

//       } else if ((role === 'EVM_Staff' || role === 'Admin') ) {
//         const staffResponse = await ManageStaffService.GetStaffById(userId);
//         const { brandId } = staffResponse;

//         // GỌI API LẤY BRAND NAME
//         const brandData = await ManageBrandService.GetBrandById(brandId);
//         const brandName = brandData.brandName;
//         const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');

//         localStorage.setItem('staffInfo', JSON.stringify({
//           ...staffResponse,
//           brandName,
//           brandSlug
//         }));

//         navigate(`/brands/${brandSlug}/brand-vehicles`);
//         toast.success('Đăng nhập thành công!');
//       } else if (role === 'Admin') {
//         // Chỉ navigate, không gọi API thêm
//         navigate('/admin');
//         toast.success('Đăng nhập thành công! Chào mừng Admin.');
        
//       } else {
//         // Role không hợp lệ
//         throw new Error('Role không được hỗ trợ.');
//       }

//     } catch (error) {
//       console.error('Error during login:', error);
//       const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
//       setError(errorMsg);
//       toast.error(errorMsg);
//       // Xóa token nếu có lỗi
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6} lg={5} xl={4}>
//             <Card className="login-card shadow-lg">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <div className="login-icon mb-3">🔐</div>
//                   <h2 className="login-title">Login System</h2>
//                   <p className="login-subtitle">EV Dealer Management System</p>
//                 </div>

//                 <Form onSubmit={handleSubmit}>
//                   {error && <Alert variant="danger">{error}</Alert>}

//                   <Form.Group className="mb-3">
//                     <Form.Label>Email</Form.Label> {/* Đổi label */}
//                     <Form.Control
//                       type="email" // Đổi thành email type
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="login-input"
//                       required
//                       disabled={loading}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="login-input"
//                       required
//                       disabled={loading}
//                     />
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     type="submit"
//                     className="w-100 login-button"
//                     disabled={!email || !password || loading}
//                   >
//                     {loading ? 'Loging in...' : 'Login'}
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-3">
//                   {/* Có thể add forgot password sau */}
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login;

// fix admin
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Để show error/success (nếu chưa import, add vào)
import { useAuth } from '../context/AuthContext';
import '../styles/Login.scss';
import { jwtDecode } from "jwt-decode";
import LoginService from '../services/LoginSystem/LoginService'; // Import service từ trước (giả sử path đúng)
import ManageDealerService from '../services/ManageDealer/ManageDealerService';
import ManageStaffService from '../services/ManageStaff/ManageStaffService';
import ManageBrandService from '../services/ManageBrand/ManageBrandService';
import ManageStoreService from '../services/ManageStore/ManageStoreService';

const Login = () => {
  const [email, setEmail] = useState(''); // Đổi từ username thành email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Thêm loading state
  const [error, setError] = useState(''); // Để show error tạm thời
  const { login } = useAuth(); // Giả sử login() set token vào context
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
      // Gọi API login
      const response = await LoginService.login(email, password);
      const { token, expiresIn } = response;

      // Lưu token vào localStorage (và có thể refresh token logic sau)
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expiresIn);

      // Decode JWT để lấy info
      const decoded = jwtDecode(token);
      const { nameid: userId, role } = decoded;
      console.log('Decoded JWT:', decoded); // Để debug, xóa sau

      // Đồng bộ thông tin cơ bản vào AuthContext để hiển thị trên header
      const displayRole = role
        ? role
            .toLowerCase()
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
        : 'User';
      login(displayRole, email);

      // Phân role và xử lý
      if (role === 'Dealer_staff' || role === 'Dealer_manager') {
        const dealerResponse = await ManageDealerService.GetDealerById(userId);
        const { storeId } = dealerResponse;

        // GỌI API LẤY STORE NAME
        const storeData = await ManageStoreService.getStoreById(storeId);
        const storeName = storeData.storeName;
        const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-');

        // Lưu cả ID + Name + Slug
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

        // GỌI API LẤY BRAND NAME
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
        // Xử lý cho role Admin: gọi GetStaffById để check brandId
        const staffResponse = await ManageStaffService.GetStaffById(userId);
        const { brandId } = staffResponse;

        // Chỉ navigate tới /admin nếu brandId là null
        if (brandId === null) {
          // Gọi thêm API getAllStaffs
          const allStaffsResponse = await ManageStaffService.getAllStaffs();
          // Lưu allStaffs vào localStorage (giả sử dùng cho dashboard admin)
          localStorage.setItem('allStaffs', JSON.stringify(allStaffsResponse));

          // Lưu staffInfo cho admin (không có brandName/slug)
          localStorage.setItem('staffInfo', JSON.stringify(staffResponse));

          navigate('/admin/account-management');
          toast.success('Login Success! Welcome Admin.');
        } else {
          // Nếu brandId không null, xử lý như EVM_Staff (brand admin)
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
        // Role không hợp lệ
        throw new Error('Role không được hỗ trợ.');
      }

    } catch (error) {
      console.error('Error during login:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMsg);
      toast.error(errorMsg);
      // Xóa token nếu có lỗi
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
                    <Form.Label>Email</Form.Label> {/* Đổi label */}
                    <Form.Control
                      type="email" // Đổi thành email type
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
                  {/* Có thể add forgot password sau */}
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