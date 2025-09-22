// src/pages/HomePage/SearchBar.jsx (giữ nguyên)
import React from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/SearchBar.scss';

const SearchBar = ({ placeholder }) => {
    return (
        <div className="search-bar eco-search">
            <Form.Control
                type="text"
                placeholder={placeholder}
                className="eco-input"
            />
        </div>
    );
};

export default SearchBar;