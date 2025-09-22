// src/pages/HomePage/VehicleCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import ActionButtons from './ActionButtons';
import '../../../styles/VehicleCard.scss';

const VehicleCard = ({ vehicle }) => {
    return (
        <Card className="vehicle-card eco-card">
            <div className="card-image-wrapper">
                <Card.Img
                    variant="top"
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="eco-card-img"
                />
                <div className={`stock-badge eco-badge ${vehicle.stockType}`}>
                    {vehicle.stock}
                </div>
            </div>
            <Card.Body className="eco-card-body">
                <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
                <Card.Text className="eco-card-text">
                    <div>Range: {vehicle.specs.range}</div>
                    <div>0-60 mph: {vehicle.specs.acceleration}</div>
                    <div>Category: {vehicle.specs.category}</div>
                </Card.Text>
                <Card.Text className="eco-price">{vehicle.price}</Card.Text>
                <ActionButtons />
            </Card.Body>
        </Card>
    );
};

export default VehicleCard;