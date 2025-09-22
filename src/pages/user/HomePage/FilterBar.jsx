// src/pages/HomePage/FilterBar.jsx
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/FilterBar.scss';
import SearchBar from './SearchBar';

const FilterBar = () => {
    const [status, setStatus] = useState('All Status');
    const [category, setCategory] = useState('All Categories');

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    return (
        <div className="filter-bar eco-filter">
            <div className="search-wrapper">
                <SearchBar placeholder="Search vehicle name..." />
            </div>
            <div className="filters-right">
                <div className="filter-group">
                    <label htmlFor="category">Category:</label>
                    <Form.Select
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                        className="eco-select"
                    >
                        <option>All Categories</option>
                        <option>Sedan</option>
                        <option>SUV</option>
                        <option>Sports Car</option>
                    </Form.Select>
                </div>
                <div className="filter-group">
                    <label htmlFor="status">Status:</label>
                    <Form.Select
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                        className="eco-select"
                    >
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Limited</option>
                        <option>Out of Stock</option>
                    </Form.Select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;