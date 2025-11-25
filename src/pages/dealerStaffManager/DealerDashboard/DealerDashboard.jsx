// import React, { useState } from 'react';
// import {
//     Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert
// } from 'react-bootstrap';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from 'recharts';
// import '../../../styles/dealerStaffManager/DealerDashboard.scss'; // Assume a new SCSS file for this component

// const DealerDashboard = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     // Hard-coded data for now
//     const stats = {
//         totalRevenue: 1000000,
//         todayRevenue: 50000,
//         weekRevenue: 200000,
//         monthRevenue: 500000,
//         yearRevenue: 1000000
//     };

//     const salesData = {
//         totalCarsSold: 50,
//         bestSeller: { model: 'Toyota Camry 2024', units: 15 },
//         worstSeller: { model: 'Kia Seltos 2024', units: 2 },
//         topDealer: { name: 'John Doe', transactions: 20 },
//         topCustomer: { name: 'Jane Smith', spent: 100000000 }
//     };

//     const comparisonData = {
//         vsPrevWeek: { current: 12, prev: 10, change: '+20%' },
//         vsPrevMonth: { current: 45, prev: 40, change: '+12.5%' },
//         vsPrevYear: { current: 500, prev: 450, change: '+11.1%' }
//     };

//     const recentTransactions = [
//         {
//             id: 1,
//             date: '2025-11-08',
//             customer: 'Nguyễn Văn A',
//             vehicle: 'Toyota Camry 2024',
//             amount: 25000000,
//             status: 'Completed'
//         },
//         {
//             id: 2,
//             date: '2025-11-07',
//             customer: 'Trần Thị B',
//             vehicle: 'Honda Civic 2023',
//             amount: 18000000,
//             status: 'Completed'
//         },
//         {
//             id: 3,
//             date: '2025-11-06',
//             customer: 'Lê Văn C',
//             vehicle: 'Mazda CX-5 2024',
//             amount: 32000000,
//             status: 'Pending'
//         },
//         {
//             id: 4,
//             date: '2025-11-05',
//             customer: 'Phạm Thị D',
//             vehicle: 'Hyundai Tucson 2023',
//             amount: 22000000,
//             status: 'Completed'
//         },
//         {
//             id: 5,
//             date: '2025-11-04',
//             customer: 'Hoàng Văn E',
//             vehicle: 'Kia Seltos 2024',
//             amount: 15000000,
//             status: 'Cancelled'
//         }
//     ];

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('vi-VN', {
//             style: 'currency',
//             currency: 'VND'
//         }).format(amount);
//     };

//     // Recharts data for monthly revenue (line chart with fluctuations)
//     const chartData = [
//         { month: 'Jan', revenue: 80000 },
//         { month: 'Feb', revenue: 120000 },
//         { month: 'Mar', revenue: 90000 },
//         { month: 'Apr', revenue: 150000 },
//         { month: 'May', revenue: 110000 },
//         { month: 'Jun', revenue: 140000 },
//         { month: 'Jul', revenue: 130000 },
//         { month: 'Aug', revenue: 160000 },
//         { month: 'Sep', revenue: 170000 },
//         { month: 'Oct', revenue: 180000 },
//         { month: 'Nov', revenue: 500000 }
//     ];

//     // Simulate loading
//     if (loading) {
//         return (
//             <div className="dashboard-page">
//                 <Container fluid className="py-4">
//                     <div className="text-center py-5">
//                         <Spinner animation="border" />
//                         <p>Loading dashboard...</p>
//                     </div>
//                 </Container>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="dashboard-page">
//                 <Container fluid className="py-4">
//                     <Alert variant="danger">{error}</Alert>
//                 </Container>
//             </div>
//         );
//     }

//     return (
//         <div className="dashboard-page">
//             <Container fluid className="py-4">
//                 <Row className="align-items-center mb-4">
//                     <Col md={6}>
//                         <div className="page-header">
//                             <h1 className="page-title">Dealer Dashboard</h1>
//                             <p className="page-subtitle">Track store revenue and transactions</p>
//                         </div>
//                     </Col>
//                     <Col md={6} className="text-end">
//                         <Button variant="outline-primary" onClick={() => window.location.reload()}>
//                             Refresh
//                         </Button>
//                     </Col>
//                 </Row>

//                 {/* Revenue Section - Separated Row */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Revenue Overview</h3>
//                     </Col>
//                     <Col md={3} className="mb-3">
//                         <Card className="stat-card total">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
//                                 <div className="stat-label">Total Revenue</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={3} className="mb-3">
//                         <Card className="stat-card today">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.todayRevenue)}</div>
//                                 <div className="stat-label">Today</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={3} className="mb-3">
//                         <Card className="stat-card week">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.weekRevenue)}</div>
//                                 <div className="stat-label">This Week</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={3} className="mb-3">
//                         <Card className="stat-card month">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.monthRevenue)}</div>
//                                 <div className="stat-label">This Month</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Separator for clarity */}
//                 <hr className="my-5" style={{ borderColor: '#e2e8f0', borderWidth: '2px' }} />

//                 {/* Sales Section - Separated Row */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Sales Overview</h3>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card sales">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.totalCarsSold}</div>
//                                 <div className="stat-label">Total Cars Sold</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card bestseller">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.bestSeller.units}</div>
//                                 <div className="stat-label">Best Seller<br /><small>{salesData.bestSeller.model}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card worstseller">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.worstSeller.units}</div>
//                                 <div className="stat-label">Worst Seller<br /><small>{salesData.worstSeller.model}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Top Performers Section - Including Top Dealer and Top Customer */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Top Performers</h3>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-dealer">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.topDealer.transactions}</div>
//                                 <div className="stat-label">Top Dealer (Most Transactions)<br /><small>{salesData.topDealer.name}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-customer">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(salesData.topCustomer.spent)}</div>
//                                 <div className="stat-label">Top Customer (Highest Spend)<br /><small>{salesData.topCustomer.name}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Comparison Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Performance Comparison</h3>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card comparison">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{comparisonData.vsPrevWeek.current} <Badge bg="success">{comparisonData.vsPrevWeek.change}</Badge></div>
//                                 <div className="stat-label">vs Previous Week</div>
//                                 <div className="stat-subtext">Prev: {comparisonData.vsPrevWeek.prev} cars</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card comparison">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{comparisonData.vsPrevMonth.current} <Badge bg="success">{comparisonData.vsPrevMonth.change}</Badge></div>
//                                 <div className="stat-label">vs Previous Month</div>
//                                 <div className="stat-subtext">Prev: {comparisonData.vsPrevMonth.prev} cars</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card comparison">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{comparisonData.vsPrevYear.current} <Badge bg="success">{comparisonData.vsPrevYear.change}</Badge></div>
//                                 <div className="stat-label">vs Previous Year</div>
//                                 <div className="stat-subtext">Prev: {comparisonData.vsPrevYear.prev} cars</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Year Revenue and Chart Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Yearly Overview</h3>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card year-large">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number-large">{formatCurrency(stats.yearRevenue)}</div>
//                                 <div className="stat-label">This Year Revenue</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="chart-card">
//                             <Card.Body>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <LineChart data={chartData}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="month" />
//                                         <YAxis tickFormatter={(value) => formatCurrency(value * 1000)} />
//                                         <Tooltip formatter={(value) => [formatCurrency(value * 1000), 'Revenue']} />
//                                         <Legend />
//                                         <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Recent Transactions */}
//                 <Row>
//                     <Col md={12}>
//                         <h3 className="section-title">Recent Transactions</h3>
//                         <Card className="main-card">
//                             <Card.Body className="p-0">
//                                 <Table hover responsive className="transaction-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>ID</th>
//                                             <th>Date</th>
//                                             <th>Customer</th>
//                                             <th>Vehicle</th>
//                                             <th>Amount</th>
//                                             <th>Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {recentTransactions.map((tx) => (
//                                             <tr key={tx.id}>
//                                                 <td>{tx.id}</td>
//                                                 <td>{tx.date}</td>
//                                                 <td><strong>{tx.customer}</strong></td>
//                                                 <td>{tx.vehicle}</td>
//                                                 <td>{formatCurrency(tx.amount)}</td>
//                                                 <td>
//                                                     <Badge
//                                                         bg={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'}
//                                                     >
//                                                         {tx.status}
//                                                     </Badge>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default DealerDashboard;

//--------------------------------------------------------------//

// import React, { useState, useEffect } from 'react';
// import {
//     Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert
// } from 'react-bootstrap';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from 'recharts';
// import '../../../styles/dealerStaffManager/DealerDashboard.scss'; // Assume a new SCSS file for this component
// import DealerDashboardService from '../../../services/DealerDashboardService/DealerDashboardService';

// const DealerDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // Dynamic data from APIs
//     const [stats, setStats] = useState({
//         totalRevenue: 0,
//         yearRevenue: 0
//     });

//     const [salesData, setSalesData] = useState({
//         totalCarsSold: 0,
//         bestSeller: { model: 'Toyota Camry 2024', units: 15 },
//         worstSeller: { model: 'Kia Seltos 2024', units: 2 },
//         topVehicles: [],
//         bottomVehicles: []
//     });

//     const [topPerformers, setTopPerformers] = useState({
//         topDealer: { name: 'Unknown', transactions: 0 },
//         topCustomer: { name: 'Unknown', spent: 0 }
//     });

//     const [chartData, setChartData] = useState([]);

//     // Hard-coded data (as instructed)
//     const recentTransactions = [
//         {
//             id: 1,
//             date: '2025-11-08',
//             customer: 'Nguyễn Văn A',
//             vehicle: 'Toyota Camry 2024',
//             amount: 25000000,
//             status: 'Completed'
//         },
//         {
//             id: 2,
//             date: '2025-11-07',
//             customer: 'Trần Thị B',
//             vehicle: 'Honda Civic 2023',
//             amount: 18000000,
//             status: 'Completed'
//         },
//         {
//             id: 3,
//             date: '2025-11-06',
//             customer: 'Lê Văn C',
//             vehicle: 'Mazda CX-5 2024',
//             amount: 32000000,
//             status: 'Pending'
//         },
//         {
//             id: 4,
//             date: '2025-11-05',
//             customer: 'Phạm Thị D',
//             vehicle: 'Hyundai Tucson 2023',
//             amount: 22000000,
//             status: 'Completed'
//         },
//         {
//             id: 5,
//             date: '2025-11-04',
//             customer: 'Hoàng Văn E',
//             vehicle: 'Kia Seltos 2024',
//             amount: 15000000,
//             status: 'Cancelled'
//         }
//     ];

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('vi-VN', {
//             style: 'currency',
//             currency: 'VND'
//         }).format(amount);
//     };

//     // Helper to get current storeId
//     const getCurrentStoreId = () => {
//         const dealerInfoStr = localStorage.getItem('dealerInfo');
//         if (!dealerInfoStr) {
//             throw new Error('No dealerInfo in localStorage');
//         }
//         const dealerInfo = JSON.parse(dealerInfoStr);
//         const storeId = dealerInfo.storeId;
//         if (!storeId) {
//             throw new Error('No storeId found in dealerInfo');
//         }
//         return storeId;
//     };

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 const storeId = getCurrentStoreId();

//                 const [summary, topDealer, topCustomer, revenueByMonth, topVehicles, bottomVehicles] = await Promise.all([
//                     DealerDashboardService.getSummary(storeId),
//                     DealerDashboardService.getTopDealer(storeId),
//                     DealerDashboardService.getTopCustomer(storeId),
//                     DealerDashboardService.getRevenueByMonth(storeId),
//                     DealerDashboardService.getTopVehicles(storeId, 5),
//                     DealerDashboardService.getBottomVehicles(storeId, 5)
//                 ]);

//                 // Update stats
//                 const yearRevenue = revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
//                 setStats({
//                     totalRevenue: summary.totalRevenue,
//                     yearRevenue
//                 });

//                 // Update sales
//                 const bestSellerFromApi = topVehicles.length > 0 ? topVehicles[0] : { modelName: 'Unknown', quantity: 0 };
//                 const worstSellerFromApi = bottomVehicles.length > 0 ? bottomVehicles[0] : { modelName: 'Unknown', quantity: 0 };
//                 setSalesData({
//                     totalCarsSold: summary.totalVehiclesSold,
//                     bestSeller: { model: bestSellerFromApi.modelName, units: bestSellerFromApi.quantity },
//                     worstSeller: { model: worstSellerFromApi.modelName, units: worstSellerFromApi.quantity },
//                     topVehicles,
//                     bottomVehicles
//                 });

//                 // Update top performers
//                 setTopPerformers({
//                     topDealer: {
//                         name: topDealer.dealerName,
//                         transactions: topDealer.ordersCount
//                     },
//                     topCustomer: {
//                         name: topCustomer.customerName,
//                         spent: topCustomer.totalSpent
//                     }
//                 });

//                 // Update chart data
//                 setChartData(revenueByMonth.map(item => ({
//                     month: item.month,
//                     revenue: item.revenue
//                 })));

//             } catch (err) {
//                 console.error('Error fetching dashboard data:', err);
//                 setError('Failed to load dashboard data.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="dashboard-page">
//                 <Container fluid className="py-4">
//                     <div className="text-center py-5">
//                         <Spinner animation="border" />
//                         <p>Loading dashboard...</p>
//                     </div>
//                 </Container>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="dashboard-page">
//                 <Container fluid className="py-4">
//                     <Alert variant="danger">{error}</Alert>
//                 </Container>
//             </div>
//         );
//     }

//     return (
//         <div className="dashboard-page">
//             <Container fluid className="py-4">
//                 <Row className="align-items-center mb-4">
//                     <Col md={6}>
//                         <div className="page-header">
//                             <h1 className="page-title">Dealer Dashboard</h1>
//                             <p className="page-subtitle">Track store revenue and transactions</p>
//                         </div>
//                     </Col>
//                     <Col md={6} className="text-end">
//                         <Button variant="outline-primary" onClick={() => window.location.reload()}>
//                             Refresh
//                         </Button>
//                     </Col>
//                 </Row>

//                 {/* Revenue Section - Only Total Revenue */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Revenue Overview</h3>
//                     </Col>
//                     <Col md={12} className="mb-3">
//                         <Card className="stat-card total">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
//                                 <div className="stat-label">Total Revenue</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Separator for clarity */}
//                 <hr className="my-5" style={{ borderColor: '#e2e8f0', borderWidth: '2px' }} />

//                 {/* Sales Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Sales Overview</h3>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card sales">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.totalCarsSold}</div>
//                                 <div className="stat-label">Total Cars Sold</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card bestseller">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.bestSeller.units}</div>
//                                 <div className="stat-label">Best Seller<br /><small>{salesData.bestSeller.model}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card worstseller">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{salesData.worstSeller.units}</div>
//                                 <div className="stat-label">Worst Seller<br /><small>{salesData.worstSeller.model}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Top 5 Vehicles Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Top 5 Best-Selling Vehicles</h3>
//                     </Col>
//                     <Col md={12}>
//                         <Card className="main-card">
//                             <Card.Body className="p-0">
//                                 <Table hover responsive className="vehicle-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>Rank</th>
//                                             <th>Model</th>
//                                             <th>Quantity Sold</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {salesData.topVehicles.map((vehicle, index) => (
//                                             <tr key={index}>
//                                                 <td>{index + 1}</td>
//                                                 <td><strong>{vehicle.modelName}</strong></td>
//                                                 <td>{vehicle.quantity}</td>
//                                             </tr>
//                                         ))}
//                                         {salesData.topVehicles.length === 0 && (
//                                             <tr>
//                                                 <td colSpan="3" className="text-center">No data available</td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Bottom 5 Vehicles Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Top 5 Least-Selling Vehicles</h3>
//                     </Col>
//                     <Col md={12}>
//                         <Card className="main-card">
//                             <Card.Body className="p-0">
//                                 <Table hover responsive className="vehicle-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>Rank</th>
//                                             <th>Model</th>
//                                             <th>Quantity Sold</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {salesData.bottomVehicles.map((vehicle, index) => (
//                                             <tr key={index}>
//                                                 <td>{index + 1}</td>
//                                                 <td><strong>{vehicle.modelName}</strong></td>
//                                                 <td>{vehicle.quantity}</td>
//                                             </tr>
//                                         ))}
//                                         {salesData.bottomVehicles.length === 0 && (
//                                             <tr>
//                                                 <td colSpan="3" className="text-center">No data available</td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Top Performers Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Top Performers</h3>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-dealer">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{topPerformers.topDealer.transactions}</div>
//                                 <div className="stat-label">Top Dealer (Most Transactions)<br /><small>{topPerformers.topDealer.name}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-customer">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(topPerformers.topCustomer.spent)}</div>
//                                 <div className="stat-label">Top Customer (Highest Spend)<br /><small>{topPerformers.topCustomer.name}</small></div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Year Revenue and Chart Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3">
//                         <h3 className="section-title">Yearly Overview</h3>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card year-large">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number-large">{formatCurrency(stats.yearRevenue)}</div>
//                                 <div className="stat-label">This Year Revenue</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="chart-card">
//                             <Card.Body>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <LineChart data={chartData}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="month" />
//                                         <YAxis tickFormatter={(value) => formatCurrency(value)} />
//                                         <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
//                                         <Legend />
//                                         <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Recent Transactions */}
//                 <Row>
//                     <Col md={12}>
//                         <h3 className="section-title">Recent Transactions</h3>
//                         <Card className="main-card">
//                             <Card.Body className="p-0">
//                                 <Table hover responsive className="transaction-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>ID</th>
//                                             <th>Date</th>
//                                             <th>Customer</th>
//                                             <th>Vehicle</th>
//                                             <th>Amount</th>
//                                             <th>Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {recentTransactions.map((tx) => (
//                                             <tr key={tx.id}>
//                                                 <td>{tx.id}</td>
//                                                 <td>{tx.date}</td>
//                                                 <td><strong>{tx.customer}</strong></td>
//                                                 <td>{tx.vehicle}</td>
//                                                 <td>{formatCurrency(tx.amount)}</td>
//                                                 <td>
//                                                     <Badge
//                                                         bg={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'}
//                                                     >
//                                                         {tx.status}
//                                                     </Badge>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default DealerDashboard;

//---------------------------------------------------------//

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert,
//     Pagination as BSPagination, InputGroup, FormControl, Form // THÊM 3 COMPONENT NÀY
// } from 'react-bootstrap';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from 'recharts';
// import '../../../styles/dealerStaffManager/DealerDashboard.scss';
// import DealerDashboardService from '../../../services/DealerDashboardService/DealerDashboardService';

// const DealerDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const [stats, setStats] = useState({ totalRevenue: 0, yearRevenue: 0 });
//     const [salesData, setSalesData] = useState({
//         totalCarsSold: 0,
//         bestSeller: { model: 'Toyota Camry 2024', units: 15 },
//         worstSeller: { model: 'Kia Seltos 2024', units: 2 },
//         topVehicles: [], bottomVehicles: []
//     });
//     const [topPerformers, setTopPerformers] = useState({
//         topDealer: { name: 'Unknown', transactions: 0 },
//         topCustomer: { name: 'Unknown', spent: 0 }
//     });
//     const [chartData, setChartData] = useState([]);
//     const [recentTransactions, setRecentTransactions] = useState([]);

//     // THÊM: Search + Filter
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');

//     // Sorting and pagination (giữ nguyên)
//     const [sortBy, setSortBy] = useState('date');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
//     };

//     const getCurrentStoreId = () => {
//         const dealerInfoStr = localStorage.getItem('dealerInfo');
//         if (!dealerInfoStr) throw new Error('No dealerInfo in localStorage');
//         const dealerInfo = JSON.parse(dealerInfoStr);
//         if (!dealerInfo.storeId) throw new Error('No storeId found in dealerInfo');
//         return dealerInfo.storeId;
//     };

//     const mapToTransactions = (orders) => {
//         const orderArray = Array.isArray(orders) ? orders : [orders];
//         return orderArray.map((order) => ({
//             id: order.orderId,
//             date: order.orderDate || 'N/A',
//             customer: order.customer?.fullName || 'Unknown',
//             email: order.customer?.email || 'N/A',
//             vehicle: order.quotes?.[0]?.vehicle?.modelName || 'Unknown',
//             amount: order.totalPrice || 0,
//             status: order.status || 'Unknown'
//         }));
//     };

//     const getStatusVariant = (status) => {
//         switch (String(status).toLowerCase()) {
//             case 'completed': return 'success';
//             case 'pending': return 'warning';
//             case 'processing': return 'info';
//             case 'cancelled': return 'danger';
//             default: return 'secondary';
//         }
//     };

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 const storeId = getCurrentStoreId();
//                 const [summary, topDealer, topCustomer, revenueByMonth, topVehicles, bottomVehicles, recentOrders] = await Promise.all([
//                     DealerDashboardService.getSummary(storeId),
//                     DealerDashboardService.getTopDealer(storeId),
//                     DealerDashboardService.getTopCustomer(storeId),
//                     DealerDashboardService.getRevenueByMonth(storeId),
//                     DealerDashboardService.getTopVehicles(storeId, 5),
//                     DealerDashboardService.getBottomVehicles(storeId, 5),
//                     DealerDashboardService.getRecentOrders(storeId)
//                 ]);

//                 const yearRevenue = revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
//                 setStats({ totalRevenue: summary.totalRevenue, yearRevenue });

//                 const bestSellerFromApi = topVehicles[0] || { modelName: 'Unknown', quantity: 0 };
//                 const worstSellerFromApi = bottomVehicles[0] || { modelName: 'Unknown', quantity: 0 };
//                 setSalesData({
//                     totalCarsSold: summary.totalVehiclesSold,
//                     bestSeller: { model: bestSellerFromApi.modelName, units: bestSellerFromApi.quantity },
//                     worstSeller: { model: worstSellerFromApi.modelName, units: worstSellerFromApi.quantity },
//                     topVehicles, bottomVehicles
//                 });

//                 setTopPerformers({
//                     topDealer: { name: topDealer.dealerName, transactions: topDealer.ordersCount },
//                     topCustomer: { name: topCustomer.customerName, spent: topCustomer.totalSpent }
//                 });

//                 setChartData(revenueByMonth.map(item => ({ month: item.month, revenue: item.revenue })));
//                 setRecentTransactions(mapToTransactions(recentOrders));

//             } catch (err) {
//                 console.error('Error fetching dashboard data:', err);
//                 setError('Failed to load dashboard data.');
//                 setRecentTransactions([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     // THAY ĐỔI: Filter + Search + Sort + Pagination
//     const filteredTransactions = useMemo(() => {
//         let result = recentTransactions;

//         // Filter theo status
//         if (statusFilter !== 'all') {
//             result = result.filter(tx => String(tx.status).toLowerCase() === statusFilter.toLowerCase());
//         }

//         // Search theo tên hoặc email
//         if (searchTerm.trim()) {
//             const term = searchTerm.trim().toLowerCase(); // THÊM .trim() Ở ĐÂY!
//             result = result.filter(tx =>
//                 tx.customer.toLowerCase().includes(term) ||
//                 tx.email.toLowerCase().includes(term)
//             );
//         }

//         return result;
//     }, [recentTransactions, statusFilter, searchTerm]);

//     const sortedTransactions = useMemo(() => {
//         return [...filteredTransactions].sort((a, b) => {
//             let aVal, bVal;
//             if (sortBy === 'date') {
//                 const parseDate = (d) => d && d !== 'N/A' ? new Date(d.split('-').reverse().join('-')).getTime() : 0;
//                 aVal = parseDate(a.date);
//                 bVal = parseDate(b.date);
//             } else if (sortBy === 'amount') {
//                 aVal = a.amount;
//                 bVal = b.amount;
//             }
//             return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
//         });
//     }, [filteredTransactions, sortBy, sortOrder]);

//     const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
//     const paginatedTransactions = sortedTransactions.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handleSort = (newSortBy) => {
//         if (sortBy === newSortBy) {
//             setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortBy(newSortBy);
//             setSortOrder('desc');
//         }
//         setCurrentPage(1);
//     };

//     // Reset trang khi search/filter
//     useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

//     if (loading) return <div className="dashboard-page"><Container fluid className="py-4"><div className="text-center py-5"><Spinner animation="border" /><p>Loading dashboard...</p></div></Container></div>;
//     if (error) return <div className="dashboard-page"><Container fluid className="py-4"><Alert variant="danger">{error}</Alert></Container></div>;

//     return (
//         <div className="dashboard-page">
//             <Container fluid className="py-4">
//                 {/* === TẤT CẢ PHẦN TRÊN GIỮ NGUYÊN 100% (từ Revenue đến Yearly Overview) === */}
//                 <Row className="align-items-center mb-4">
//                     <Col md={6}>
//                         <div className="page-header">
//                             <h1 className="page-title">Dealer Dashboard</h1>
//                             <p className="page-subtitle">Track store revenue and transactions</p>
//                         </div>
//                     </Col>
//                     <Col md={6} className="text-end">
//                         <Button variant="outline-primary" onClick={() => window.location.reload()}>
//                             Refresh
//                         </Button>
//                     </Col>
//                 </Row>

//                 {/* Revenue Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Revenue Overview</h3></Col>
//                     <Col md={12} className="mb-3">
//                         <Card className="stat-card total">
//                             <Card.Body className="text-center">
//                                 <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
//                                 <div className="stat-label">Total Revenue</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 <hr className="my-5" style={{ borderColor: '#e2e8f0', borderWidth: '2px' }} />

//                 {/* Sales Section */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Sales Overview</h3></Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card sales"><Card.Body className="text-center"><div className="stat-number">{salesData.totalCarsSold}</div><div className="stat-label">Total Cars Sold</div></Card.Body></Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card bestseller"><Card.Body className="text-center"><div className="stat-number">{salesData.bestSeller.units}</div><div className="stat-label">Best Seller<br /><small>{salesData.bestSeller.model}</small></div></Card.Body></Card>
//                     </Col>
//                     <Col md={4} className="mb-3">
//                         <Card className="stat-card worstseller"><Card.Body className="text-center"><div className="stat-number">{salesData.worstSeller.units}</div><div className="stat-label">Worst Seller<br /><small>{salesData.worstSeller.model}</small></div></Card.Body></Card>
//                     </Col>
//                 </Row>

//                 {/* Top 5 & Bottom 5 Vehicles */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Top 5 Best-Selling Vehicles</h3></Col>
//                     <Col md={12}>
//                         <Card className="main-card"><Card.Body className="p-0">
//                             <Table hover responsive className="vehicle-table mb-0">
//                                 <thead><tr><th>Rank</th><th>Model</th><th>Quantity Sold</th></tr></thead>
//                                 <tbody>
//                                     {salesData.topVehicles.map((v, i) => <tr key={i}><td>{i + 1}</td><td><strong>{v.modelName}</strong></td><td>{v.quantity}</td></tr>)}
//                                     {salesData.topVehicles.length === 0 && <tr><td colSpan="3" className="text-center">No data available</td></tr>}
//                                 </tbody>
//                             </Table>
//                         </Card.Body></Card>
//                     </Col>
//                 </Row>

//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Top 5 Least-Selling Vehicles</h3></Col>
//                     <Col md={12}>
//                         <Card className="main-card"><Card.Body className="p-0">
//                             <Table hover responsive className="vehicle-table mb-0">
//                                 <thead><tr><th>Rank</th><th>Model</th><th>Quantity Sold</th></tr></thead>
//                                 <tbody>
//                                     {salesData.bottomVehicles.map((v, i) => <tr key={i}><td>{i + 1}</td><td><strong>{v.modelName}</strong></td><td>{v.quantity}</td></tr>)}
//                                     {salesData.bottomVehicles.length === 0 && <tr><td colSpan="3" className="text-center">No data available</td></tr>}
//                                 </tbody>
//                             </Table>
//                         </Card.Body></Card>
//                     </Col>
//                 </Row>

//                 {/* Top Performers */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Top Performers</h3></Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-dealer"><Card.Body className="text-center"><div className="stat-number">{topPerformers.topDealer.transactions}</div><div className="stat-label">Top Dealer (Most Transactions)<br /><small>{topPerformers.topDealer.name}</small></div></Card.Body></Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card top-customer"><Card.Body className="text-center"><div className="stat-number">{formatCurrency(topPerformers.topCustomer.spent)}</div><div className="stat-label">Top Customer (Highest Spend)<br /><small>{topPerformers.topCustomer.name}</small></div></Card.Body></Card>
//                     </Col>
//                 </Row>

//                 {/* Yearly Overview */}
//                 <Row className="mb-5">
//                     <Col md={12} className="mb-3"><h3 className="section-title">Yearly Overview</h3></Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="stat-card year-large"><Card.Body className="text-center"><div className="stat-number-large">{formatCurrency(stats.yearRevenue)}</div><div className="stat-label">This Year Revenue</div></Card.Body></Card>
//                     </Col>
//                     <Col md={6} className="mb-3">
//                         <Card className="chart-card"><Card.Body>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <LineChart data={chartData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="month" />
//                                     <YAxis tickFormatter={formatCurrency} />
//                                     <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} />
//                                     <Legend />
//                                     <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} activeDot={{ r: 6 }} />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </Card.Body></Card>
//                     </Col>
//                 </Row>

//                 {/* CHỈ THAY ĐỔI PHẦN NÀY: Transactions */}
//                 <Row>
//                     <Col md={12}>
//                         <h3 className="section-title">Transactions</h3>

//                         {/* THÊM FILTER + SEARCH */}
//                         <Card className="mb-3 border">
//                             <Card.Body className="d-flex flex-wrap align-items-center gap-3">
//                                 <InputGroup style={{ maxWidth: '320px' }}>
//                                     <InputGroup.Text>Search</InputGroup.Text>
//                                     <FormControl
//                                         placeholder="Customer name or email..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </InputGroup>

//                                 <Form.Group>
//                                     <Form.Label className="me-2 mb-0">Status</Form.Label>
//                                     <Form.Select
//                                         value={statusFilter}
//                                         onChange={(e) => setStatusFilter(e.target.value)}
//                                         style={{ width: '180px' }}
//                                     >
//                                         <option value="all">All Status</option>
//                                         <option value="completed">Completed</option>
//                                         <option value="pending">Pending</option>
//                                         <option value="processing">Processing</option>
//                                         <option value="cancelled">Cancelled</option>
//                                     </Form.Select>
//                                 </Form.Group>

//                                 <div className="ms-auto text-muted small">
//                                     {sortedTransactions.length} transaction(s)
//                                 </div>
//                             </Card.Body>
//                         </Card>

//                         <Card className="main-card">
//                             <Card.Body className="p-0">
//                                 <Table hover responsive className="transaction-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>ID</th>
//                                             <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
//                                                 Date {sortBy === 'date' && (sortOrder === 'asc' ? ' ↑' : '↓')}
//                                             </th>
//                                             <th>Customer</th>
//                                             <th>Email</th>
//                                             <th>Vehicle</th>
//                                             <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
//                                                 Amount {sortBy === 'amount' && (sortOrder === 'asc' ? ' ↑' : '↓')}
//                                             </th>
//                                             <th>Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {paginatedTransactions.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center py-4 text-muted">
//                                                     No transactions match your filters.
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             paginatedTransactions.map((tx) => (
//                                                 <tr key={tx.id}>
//                                                     <td>{tx.id}</td>
//                                                     <td>{tx.date}</td>
//                                                     <td><strong>{tx.customer}</strong></td>
//                                                     <td>{tx.email}</td>
//                                                     <td>{tx.vehicle}</td>
//                                                     <td>{formatCurrency(tx.amount)}</td>
//                                                     <td><Badge bg={getStatusVariant(tx.status)}>{tx.status}</Badge></td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </Table>

//                                 {totalPages > 1 && (
//                                     <div className="d-flex justify-content-center py-3">
//                                         <BSPagination>
//                                             <BSPagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
//                                             {[...Array(totalPages)].map((_, i) => (
//                                                 <BSPagination.Item
//                                                     key={i + 1}
//                                                     active={i + 1 === currentPage}
//                                                     onClick={() => setCurrentPage(i + 1)}
//                                                 >
//                                                     {i + 1}
//                                                 </BSPagination.Item>
//                                             ))}
//                                             <BSPagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
//                                         </BSPagination>
//                                     </div>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default DealerDashboard;

//------------------------------------------------//

import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert,
    Pagination as BSPagination, InputGroup, FormControl, Form
} from 'react-bootstrap';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import '../../../styles/dealerStaffManager/DealerDashboard.scss';
import DealerDashboardService from '../../../services/DealerDashboardService/DealerDashboardService';

const DealerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [stats, setStats] = useState({ totalRevenue: 0, yearRevenue: 0 });
    const [salesData, setSalesData] = useState({
        totalCarsSold: 0,
        bestSeller: { model: 'N/A', units: 0 },
        worstSeller: { model: 'N/A', units: 0 },
        topVehicles: [],
        bottomVehicles: []
    });
    const [topPerformers, setTopPerformers] = useState({
        topDealer: { name: 'Unknown', transactions: 0 },
        topCustomer: { name: 'Unknown', spent: 0 }
    });
    const [chartData, setChartData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Colors
    const TOP_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    const BOTTOM_COLORS = ['#fecaca', '#fed7aa', '#fde68a', '#d9f99d', '#bfdbfe'];
    const PIE_COLORS = [
        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
        '#06b6d4', '#ec4899', '#a78bfa', '#f87171', '#34d399',
        '#84cc16', '#f97316', '#14b8a6', '#8b5cf6', '#d946ef'
    ];

    // Định dạng tiền Việt Nam: 1.234.567 đ
    const formatCurrency = (amount) => {
        if (!amount) return '0 đ';
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    };

    const getCurrentStoreId = () => {
        const dealerInfoStr = localStorage.getItem('dealerInfo');
        if (!dealerInfoStr) throw new Error('No dealerInfo in localStorage');
        const dealerInfo = JSON.parse(dealerInfoStr);
        if (!dealerInfo.storeId) throw new Error('No storeId found in dealerInfo');
        return dealerInfo.storeId;
    };

    const mapToTransactions = (orders) => {
        const orderArray = Array.isArray(orders) ? orders : [orders];
        return orderArray.map((order) => ({
            id: order.orderId,
            date: order.orderDate || 'N/A',
            customer: order.customer?.fullName || 'Unknown',
            email: order.customer?.email || 'N/A',
            vehicle: order.quotes?.[0]?.vehicle?.modelName || 'Unknown',
            amount: order.totalPrice || 0,
            status: order.status || 'Unknown'
        }));
    };

    const getStatusVariant = (status) => {
        switch (String(status).toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError('');
            try {
                const storeId = getCurrentStoreId();

                const [
                    summary, topDealer, topCustomer, revenueByMonth,
                    topVehicles, bottomVehicles, recentOrders, inventory
                ] = await Promise.all([
                    DealerDashboardService.getSummary(storeId),
                    DealerDashboardService.getTopDealer(storeId),
                    DealerDashboardService.getTopCustomer(storeId),
                    DealerDashboardService.getRevenueByMonth(storeId),
                    DealerDashboardService.getTopVehicles(storeId, 5),
                    DealerDashboardService.getBottomVehicles(storeId, 5),
                    DealerDashboardService.getRecentOrders(storeId),
                    DealerDashboardService.getInventory(storeId)
                ]);

                const yearRevenue = revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
                setStats({ totalRevenue: summary.totalRevenue, yearRevenue });

                const bestSellerFromApi = topVehicles[0] || { modelName: 'N/A', quantity: 0 };
                const worstSellerFromApi = bottomVehicles[0] || { modelName: 'N/A', quantity: 0 };

                setSalesData({
                    totalCarsSold: summary.totalVehiclesSold,
                    bestSeller: { model: bestSellerFromApi.modelName, units: bestSellerFromApi.quantity },
                    worstSeller: { model: worstSellerFromApi.modelName, units: worstSellerFromApi.quantity },
                    topVehicles,
                    bottomVehicles
                });

                setTopPerformers({
                    topDealer: { name: topDealer.dealerName, transactions: topDealer.ordersCount },
                    topCustomer: { name: topCustomer.customerName, spent: topCustomer.totalSpent }
                });

                setChartData(revenueByMonth.map(item => ({ month: item.month, revenue: item.revenue })));
                setRecentTransactions(mapToTransactions(recentOrders));
                setInventoryData(inventory);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Filter + Search + Sort + Pagination
    const filteredTransactions = useMemo(() => {
        let result = recentTransactions;
        if (statusFilter !== 'all') {
            result = result.filter(tx => String(tx.status).toLowerCase() === statusFilter.toLowerCase());
        }
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(tx =>
                tx.customer.toLowerCase().includes(term) ||
                tx.email.toLowerCase().includes(term)
            );
        }
        return result;
    }, [recentTransactions, statusFilter, searchTerm]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            let aVal, bVal;
            if (sortBy === 'date') {
                const parseDate = (d) => d && d !== 'N/A' ? new Date(d.split('-').reverse().join('-')).getTime() : 0;
                aVal = parseDate(a.date);
                bVal = parseDate(b.date);
            } else if (sortBy === 'amount') {
                aVal = a.amount;
                bVal = b.amount;
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }, [filteredTransactions, sortBy, sortOrder]);

    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
    const paginatedTransactions = sortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    // Thêm đoạn này vào đâu đó trong component, trước return (gợi ý: ngay sau useEffect thứ 2)
    const renderBarLegend = (data, colors) => {
        if (!data || data.length === 0) return null;

        return (
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 px-2">
                {data.map((item, index) => (
                    <div key={index} className="d-flex align-items-center">
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                backgroundColor: colors[index % colors.length],
                                borderRadius: 3,
                                marginRight: 8
                            }}
                        />
                        <span className="small text-muted">
                            <strong>{item.modelName}</strong>: {item.quantity} units
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return (
        <div className="dashboard-page">
            <Container fluid className="py-4">
                <div className="text-center py-5">
                    <Spinner animation="border" /><p>Loading dashboard...</p>
                </div>
            </Container>
        </div>
    );

    if (error) return (
        <div className="dashboard-page">
            <Container fluid className="py-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        </div>
    );

    return (
        <div className="dashboard-page">
            <Container fluid className="py-4">
                <Row className="align-items-center mb-4">
                    <Col md={6}>
                        <div className="page-header">
                            <h1 className="page-title">Dealer Dashboard</h1>
                            <p className="page-subtitle">Track store revenue and performance</p>
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="outline-primary" onClick={() => window.location.reload()}>
                            Refresh
                        </Button>
                    </Col>
                </Row>

                {/* Revenue Overview */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3"><h3 className="section-title">Revenue Overview</h3></Col>
                    <Col md={12} className="mb-3">
                        <Card className="stat-card total">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
                                <div className="stat-label">Total Revenue</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <hr className="my-5" style={{ borderColor: '#e2e8f0', borderWidth: '2px' }} />

                {/* Sales Overview */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3"><h3 className="section-title">Sales Overview</h3></Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card sales">
                            <Card.Body className="text-center">
                                <div className="stat-number">{salesData.totalCarsSold}</div>
                                <div className="stat-label">Total Cars Sold</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card bestseller">
                            <Card.Body className="text-center">
                                <div className="stat-number">{salesData.bestSeller.units}</div>
                                <div className="stat-label">Best Seller<br /><small>{salesData.bestSeller.model}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card worstseller">
                            <Card.Body className="text-center">
                                <div className="stat-number">{salesData.worstSeller.units}</div>
                                <div className="stat-label">Worst Seller<br /><small>{salesData.worstSeller.model}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sales Performance & Inventory */}
                <Row className="mb-5">
                    <Col md={12} className="mb-4">
                        <h3 className="section-title">Sales Performance & Current Inventory</h3>
                    </Col>

                    {/* Top 5 Best-Selling */}
                    <Col lg={6} className="mb-4">
                        <Card className="chart-card h-100">
                            <Card.Body className="d-flex flex-column">
                                <h5 className="text-center mb-4 fw-bold text-primary">Top 5 Best-Selling Models</h5>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={salesData.topVehicles} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="modelName" angle={-45} textAnchor="end" height={90} tick={{ fontSize: 12 }} />
                                        <YAxis tickFormatter={(value) => Math.round(value)} allowDecimals={false} />
                                        <Tooltip formatter={(value) => `${value} units sold`} />
                                        <Bar dataKey="quantity" name="Units Sold">
                                            {salesData.topVehicles.map((_, index) => (
                                                <Cell key={`top-${index}`} fill={TOP_COLORS[index % TOP_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Dòng này là chú thích mới */}
                                {renderBarLegend(salesData.topVehicles, TOP_COLORS)}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Top 5 Least-Selling */}
                    <Col lg={6} className="mb-4">
                        <Card className="chart-card h-100">
                            <Card.Body className="d-flex flex-column">
                                <h5 className="text-center mb-4 fw-bold text-danger">Top 5 Least-Selling Models</h5>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={salesData.bottomVehicles} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="modelName" angle={-45} textAnchor="end" height={90} tick={{ fontSize: 12 }} />
                                        <YAxis tickFormatter={(value) => Math.round(value)} allowDecimals={false} />
                                        <Tooltip formatter={(value) => `${value} units sold`} />
                                        <Bar dataKey="quantity" name="Units Sold">
                                            {salesData.bottomVehicles.map((_, index) => (
                                                <Cell key={`bottom-${index}`} fill={BOTTOM_COLORS[index % BOTTOM_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Chú thích cho Least-Selling */}
                                {renderBarLegend(salesData.bottomVehicles, BOTTOM_COLORS)}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Full Inventory Pie Chart */}
                    <Col lg={12}>
                        <Card className="chart-card">
                            <Card.Body>
                                <h5 className="text-center mb-4 fw-bold text-success">Current Inventory Distribution (All Models)</h5>
                                {inventoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={500}>
                                        <PieChart>
                                            <Pie
                                                data={inventoryData}
                                                dataKey="stock"
                                                nameKey="modelName"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={160}
                                                label={({ modelName, stock }) => `${modelName.trim()}: ${stock}`}
                                                labelLine={false}
                                            >
                                                {inventoryData.map((_, index) => (
                                                    <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value} units in stock`} />
                                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center py-5 text-muted">No inventory data available</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Top Performers */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3"><h3 className="section-title">Top Performers</h3></Col>
                    <Col md={6} className="mb-3">
                        <Card className="stat-card top-dealer">
                            <Card.Body className="text-center">
                                <div className="stat-number">{topPerformers.topDealer.transactions}</div>
                                <div className="stat-label">Top Salesperson<br /><small>{topPerformers.topDealer.name}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="stat-card top-customer">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(topPerformers.topCustomer.spent)}</div>
                                <div className="stat-label">Top Spending Customer<br /><small>{topPerformers.topCustomer.name}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Yearly Revenue */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3"><h3 className="section-title">Yearly Revenue</h3></Col>
                    <Col md={6} className="mb-3">
                        <Card className="stat-card year-large">
                            <Card.Body className="text-center">
                                <div className="stat-number-large">{formatCurrency(stats.yearRevenue)}</div>
                                <div className="stat-label">This Year Revenue</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="chart-card">
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={formatCurrency} />
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Transactions */}
                <Row>
                    <Col md={12}>
                        <h3 className="section-title">Recent Transactions</h3>

                        <Card className="mb-3 border">
                            <Card.Body className="d-flex flex-wrap align-items-center gap-3">
                                <InputGroup style={{ maxWidth: '320px' }}>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <FormControl
                                        placeholder="Customer name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>

                                <Form.Group>
                                    <Form.Label className="me-2 mb-0">Status</Form.Label>
                                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '180px' }}>
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className="ms-auto text-muted small">
                                    {sortedTransactions.length} transaction(s)
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="main-card">
                            <Card.Body className="p-0">
                                <Table hover responsive className="transaction-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                                                Date {sortBy === 'date' && (sortOrder === 'asc' ? 'Up' : 'Down')}
                                            </th>
                                            <th>Customer</th>
                                            <th>Email</th>
                                            <th>Vehicle</th>
                                            <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                                                Amount {sortBy === 'amount' && (sortOrder === 'asc' ? 'Up' : 'Down')}
                                            </th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedTransactions.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-4 text-muted">No transactions found</td></tr>
                                        ) : (
                                            paginatedTransactions.map((tx) => (
                                                <tr key={tx.id}>
                                                    <td>{tx.id}</td>
                                                    <td>{tx.date}</td>
                                                    <td><strong>{tx.customer}</strong></td>
                                                    <td>{tx.email}</td>
                                                    <td>{tx.vehicle}</td>
                                                    <td>{formatCurrency(tx.amount)}</td>
                                                    <td><Badge bg={getStatusVariant(tx.status)}>{tx.status}</Badge></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center py-3">
                                        <BSPagination>
                                            <BSPagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                                            {[...Array(totalPages)].map((_, i) => (
                                                <BSPagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                                    {i + 1}
                                                </BSPagination.Item>
                                            ))}
                                            <BSPagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                                        </BSPagination>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DealerDashboard;