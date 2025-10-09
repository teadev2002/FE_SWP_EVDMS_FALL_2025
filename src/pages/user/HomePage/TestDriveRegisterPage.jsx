// src/pages/user/TestDriveRegisterPage/TestDriveRegisterPage.jsx (new for form, separate from history)
import React from 'react';
import { Container } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import TestDriveForm from './TestDriveForm'; // Assume form in same folder

const TestDriveRegisterPage = () => {
    return (
        <div className="min-h-screen eco-bg">
            <Container fluid className="eco-container">
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
                    <div className="main-content">
                        <div className="page-header">
                            <h1 className="eco-title">Test Drive Registration</h1>
                            <p className="eco-subtitle">
                                Register for a free test drive at your nearest dealership. Experience the future of electric mobility today!
                            </p>
                        </div>
                        <TestDriveForm />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TestDriveRegisterPage;