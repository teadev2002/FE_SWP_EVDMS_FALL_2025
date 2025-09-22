// src/pages/HomePage/FilterBar.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/FilterBar.scss';

const FilterBar = () => {
    return (
        <div className="filter-bar eco-filter">
            <Form.Control
                type="text"
                placeholder="Search vehicles..."
                className="eco-input me-3"
                style={{ width: '300px' }}
            />
            <Form.Select className="eco-select me-2">
                <option>All Categories</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Sports Car</option>
            </Form.Select>
            <Form.Select className="eco-select">
                <option>All Status</option>
                <option>Available</option>
                <option>Limited</option>
                <option>Out of Stock</option>
            </Form.Select>
        </div>
    );
};

export default FilterBar;