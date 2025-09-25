// src/pages/user/TestDriveRegisterPage/TestDriveRegisterPage.jsx (new for form, separate from history)
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import TestDriveForm from './TestDriveForm'; // Assume form in same folder

const TestDriveRegisterPage = () => {
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
                                <h1 className="eco-title">Test Drive Registration</h1>
                                <p className="eco-subtitle">
                                    Register for a free test drive at your nearest dealership. Experience the future of electric mobility today!
                                </p>
                            </div>
                            <TestDriveForm />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TestDriveRegisterPage;