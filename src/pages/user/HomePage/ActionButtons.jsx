// src/pages/user/HomePage/ActionButtons.jsx (unchanged)
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../../styles/ActionButtons.scss';

const ActionButtons = ({ vehicleId }) => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/vehicles/${vehicleId}`);
    };

    return (
        <div className="action-buttons eco-buttons">
            <Button variant="outline-eco" size="sm" className="me-2" onClick={handleDetailsClick}>
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