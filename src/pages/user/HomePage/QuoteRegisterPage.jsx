import React from 'react';
import { Container } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import QuoteForm from './QuoteForm';

const QuoteRegisterPage = () => {
    return (
        <div className="min-h-screen eco-bg">
            <Container fluid className="eco-container">
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
                    <div className="main-content">
                        <div className="page-header">
                            <h1 className="eco-title">Request a Quote</h1>
                            <p className="eco-subtitle">
                                Get a personalized quote for your preferred electric vehicle. Our team will contact you with the best pricing and financing options.
                            </p>
                        </div>
                        <QuoteForm />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default QuoteRegisterPage;

