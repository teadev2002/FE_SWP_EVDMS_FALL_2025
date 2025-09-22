// src/pages/HomePage/ActionButtons.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import '../../../styles/ActionButtons.scss';

const ActionButtons = () => {
    return (
        <div className="action-buttons eco-buttons">
            <Button variant="outline-eco" size="sm" className="me-2">
                Details
            </Button>
            <Button variant="outline-eco" size="sm" className="me-2">
                Compare
            </Button>
            <Button variant="eco-primary" size="sm">
                Get Quote
            </Button>
        </div>
    );
};

export default ActionButtons;