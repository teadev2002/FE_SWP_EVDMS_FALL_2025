// src/pages/user/TestDriveHistoryPage/TestDriveHistoryPage.jsx (new component for history)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import '../../../styles/TestDriveHistoryPage.scss'; // New SCSS
import Sidebar from '../../../components/sidebar/Sidebar';

const TestDriveHistoryPage = () => {
    const [testDrives, setTestDrives] = useState([]);

    useEffect(() => {
        // Load from localStorage (simulate storage)
        const saved = localStorage.getItem('testDrives');
        if (saved) {
            setTestDrives(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="min-h-screen eco-bg">
            <Container fluid className="eco-container">
                <Row className="g-0">
                    <Col md={2} className="p-0">
                        <Sidebar activeItem="Test Drives" />
                    </Col>
                    <Col md={10} className="p-4">
                        <div className="main-content">
                            <div className="page-header">
                                <h1 className="eco-title">Test Drive History</h1>
                                <p className="eco-subtitle">
                                    View your past test drive registrations and details.
                                </p>
                            </div>
                            {testDrives.length === 0 ? (
                                <Alert variant="info" className="eco-alert">
                                    No test drive registrations yet. Schedule one from a vehicle details page!
                                </Alert>
                            ) : (
                                <Row className="g-3">
                                    {testDrives.map((testDrive, index) => (
                                        <Col md={6} key={index}>
                                            <Card className="history-card eco-card">
                                                <Card.Header className="eco-card-title">
                                                    {testDrive.preferredVehicle}
                                                </Card.Header>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item><strong>Full Name:</strong> {testDrive.fullName}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Phone:</strong> {testDrive.phoneNumber}</ListGroup.Item>
                                                    <ListGroup.Item><strong>ID Number:</strong> {testDrive.idNumber}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Address:</strong> {testDrive.address}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Dealership:</strong> {testDrive.dealership}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Registration Date:</strong> {new Date().toLocaleDateString()}</ListGroup.Item>
                                                </ListGroup>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TestDriveHistoryPage;