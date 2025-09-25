// src/pages/user/HomePage/ActionButtons.jsx (updated for modal toggle and popover)
import React from 'react';
import { Button, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../../styles/ActionButtons.scss';

const ActionButtons = ({ vehicleId, selectedVehicles, selectedCount, onToggleCompare }) => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/vehicles/${vehicleId}`);
    };

    const handleCompareClick = () => {
        onToggleCompare(vehicleId);
    };

    const isSelected = selectedVehicles.some(v => v.id === vehicleId);

    const clearSelection = () => {
        // Trigger parent's clear via custom event or prop callback
        window.dispatchEvent(new CustomEvent('clearCompareSelection'));
    };

    const popoverContent = (
        <Popover id="compare-popover">
            <Popover.Header as="h3">Comparison ({selectedCount}/2)</Popover.Header>
            <Popover.Body>
                {selectedCount === 0 ? 'No vehicles selected for comparison.' :
                    selectedCount === 1 ? '1 vehicle selected. Choose another to compare.' :
                        '2 vehicles selected. Click to toggle or open comparison modal.'}
                {selectedCount > 0 && (
                    <Button variant="link" size="sm" className="p-0 mt-2 text-decoration-none" onClick={clearSelection}>

                    </Button>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="action-buttons eco-buttons">
            <Button variant="outline-eco" size="sm" className="me-2" onClick={handleDetailsClick}>
                Details
            </Button>
            <OverlayTrigger placement="top" overlay={popoverContent}>
                <Button
                    variant={isSelected ? "eco-primary" : "outline-eco"}
                    size="sm"
                    className="me-2 position-relative"
                    onClick={handleCompareClick}
                >
                    Compare {selectedCount > 0 && <Badge bg="secondary" className="ms-1">{selectedCount}</Badge>}
                    {isSelected && <span className="selected-indicator">✓</span>}
                </Button>
            </OverlayTrigger>
            <Button variant="eco-primary" size="sm">
                Get Quote
            </Button>
        </div>
    );
};

export default ActionButtons;