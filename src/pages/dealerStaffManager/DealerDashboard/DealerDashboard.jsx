import React, { useState } from 'react';
import {
    Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert
} from 'react-bootstrap';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import '../../../styles/dealerStaffManager/DealerDashboard.scss'; // Assume a new SCSS file for this component

const DealerDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Hard-coded data for now
    const stats = {
        totalRevenue: 1000000,
        todayRevenue: 50000,
        weekRevenue: 200000,
        monthRevenue: 500000,
        yearRevenue: 1000000
    };

    const salesData = {
        totalCarsSold: 50,
        bestSeller: { model: 'Toyota Camry 2024', units: 15 },
        worstSeller: { model: 'Kia Seltos 2024', units: 2 },
        topDealer: { name: 'John Doe', transactions: 20 },
        topCustomer: { name: 'Jane Smith', spent: 100000000 }
    };

    const comparisonData = {
        vsPrevWeek: { current: 12, prev: 10, change: '+20%' },
        vsPrevMonth: { current: 45, prev: 40, change: '+12.5%' },
        vsPrevYear: { current: 500, prev: 450, change: '+11.1%' }
    };

    const recentTransactions = [
        {
            id: 1,
            date: '2025-11-08',
            customer: 'Nguyễn Văn A',
            vehicle: 'Toyota Camry 2024',
            amount: 25000000,
            status: 'Completed'
        },
        {
            id: 2,
            date: '2025-11-07',
            customer: 'Trần Thị B',
            vehicle: 'Honda Civic 2023',
            amount: 18000000,
            status: 'Completed'
        },
        {
            id: 3,
            date: '2025-11-06',
            customer: 'Lê Văn C',
            vehicle: 'Mazda CX-5 2024',
            amount: 32000000,
            status: 'Pending'
        },
        {
            id: 4,
            date: '2025-11-05',
            customer: 'Phạm Thị D',
            vehicle: 'Hyundai Tucson 2023',
            amount: 22000000,
            status: 'Completed'
        },
        {
            id: 5,
            date: '2025-11-04',
            customer: 'Hoàng Văn E',
            vehicle: 'Kia Seltos 2024',
            amount: 15000000,
            status: 'Cancelled'
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Recharts data for monthly revenue (line chart with fluctuations)
    const chartData = [
        { month: 'Jan', revenue: 80000 },
        { month: 'Feb', revenue: 120000 },
        { month: 'Mar', revenue: 90000 },
        { month: 'Apr', revenue: 150000 },
        { month: 'May', revenue: 110000 },
        { month: 'Jun', revenue: 140000 },
        { month: 'Jul', revenue: 130000 },
        { month: 'Aug', revenue: 160000 },
        { month: 'Sep', revenue: 170000 },
        { month: 'Oct', revenue: 180000 },
        { month: 'Nov', revenue: 500000 }
    ];

    // Simulate loading
    if (loading) {
        return (
            <div className="dashboard-page">
                <Container fluid className="py-4">
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p>Loading dashboard...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <Container fluid className="py-4">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Container fluid className="py-4">
                <Row className="align-items-center mb-4">
                    <Col md={6}>
                        <div className="page-header">
                            <h1 className="page-title">Dealer Dashboard</h1>
                            <p className="page-subtitle">Track store revenue and transactions</p>
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="outline-primary" onClick={() => window.location.reload()}>
                            Refresh
                        </Button>
                    </Col>
                </Row>

                {/* Revenue Section - Separated Row */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3">
                        <h3 className="section-title">Revenue Overview</h3>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="stat-card total">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
                                <div className="stat-label">Total Revenue</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="stat-card today">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(stats.todayRevenue)}</div>
                                <div className="stat-label">Today</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="stat-card week">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(stats.weekRevenue)}</div>
                                <div className="stat-label">This Week</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="stat-card month">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(stats.monthRevenue)}</div>
                                <div className="stat-label">This Month</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Separator for clarity */}
                <hr className="my-5" style={{ borderColor: '#e2e8f0', borderWidth: '2px' }} />

                {/* Sales Section - Separated Row */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3">
                        <h3 className="section-title">Sales Overview</h3>
                    </Col>
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

                {/* Top Performers Section - Including Top Dealer and Top Customer */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3">
                        <h3 className="section-title">Top Performers</h3>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="stat-card top-dealer">
                            <Card.Body className="text-center">
                                <div className="stat-number">{salesData.topDealer.transactions}</div>
                                <div className="stat-label">Top Dealer (Most Transactions)<br /><small>{salesData.topDealer.name}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="stat-card top-customer">
                            <Card.Body className="text-center">
                                <div className="stat-number">{formatCurrency(salesData.topCustomer.spent)}</div>
                                <div className="stat-label">Top Customer (Highest Spend)<br /><small>{salesData.topCustomer.name}</small></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Comparison Section */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3">
                        <h3 className="section-title">Performance Comparison</h3>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card comparison">
                            <Card.Body className="text-center">
                                <div className="stat-number">{comparisonData.vsPrevWeek.current} <Badge bg="success">{comparisonData.vsPrevWeek.change}</Badge></div>
                                <div className="stat-label">vs Previous Week</div>
                                <div className="stat-subtext">Prev: {comparisonData.vsPrevWeek.prev} cars</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card comparison">
                            <Card.Body className="text-center">
                                <div className="stat-number">{comparisonData.vsPrevMonth.current} <Badge bg="success">{comparisonData.vsPrevMonth.change}</Badge></div>
                                <div className="stat-label">vs Previous Month</div>
                                <div className="stat-subtext">Prev: {comparisonData.vsPrevMonth.prev} cars</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="stat-card comparison">
                            <Card.Body className="text-center">
                                <div className="stat-number">{comparisonData.vsPrevYear.current} <Badge bg="success">{comparisonData.vsPrevYear.change}</Badge></div>
                                <div className="stat-label">vs Previous Year</div>
                                <div className="stat-subtext">Prev: {comparisonData.vsPrevYear.prev} cars</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Year Revenue and Chart Section */}
                <Row className="mb-5">
                    <Col md={12} className="mb-3">
                        <h3 className="section-title">Yearly Overview</h3>
                    </Col>
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
                                        <YAxis tickFormatter={(value) => formatCurrency(value * 1000)} />
                                        <Tooltip formatter={(value) => [formatCurrency(value * 1000), 'Revenue']} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
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
                        <Card className="main-card">
                            <Card.Body className="p-0">
                                <Table hover responsive className="transaction-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Vehicle</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td>{tx.id}</td>
                                                <td>{tx.date}</td>
                                                <td><strong>{tx.customer}</strong></td>
                                                <td>{tx.vehicle}</td>
                                                <td>{formatCurrency(tx.amount)}</td>
                                                <td>
                                                    <Badge
                                                        bg={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'}
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DealerDashboard;