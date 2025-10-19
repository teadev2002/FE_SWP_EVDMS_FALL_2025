// // src/pages/HomePage/FilterBar.jsx
// import React, { useState } from 'react';
// import { Form } from 'react-bootstrap';
// import '../../../styles/FilterBar.scss';
// import SearchBar from './SearchBar';

// const FilterBar = () => {
//     const [status, setStatus] = useState('All Status');
//     const [category, setCategory] = useState('All Categories');

//     const handleStatusChange = (e) => {
//         setStatus(e.target.value);
//     };

//     const handleCategoryChange = (e) => {
//         setCategory(e.target.value);
//     };

//     return (
//         <div className="filter-bar eco-filter">
//             <div className="search-wrapper">
//                 <SearchBar placeholder="Search vehicle name..." />
//             </div>
//             <div className="filters-right">
//                 <div className="filter-group">
//                     <label htmlFor="category">Category:</label>
//                     <Form.Select
//                         id="category"
//                         value={category}
//                         onChange={handleCategoryChange}
//                         className="eco-select"
//                     >
//                         <option>All Categories</option>
//                         <option>Sedan</option>
//                         <option>SUV</option>
//                         <option>Sports Car</option>
//                     </Form.Select>
//                 </div>
//                 <div className="filter-group">
//                     <label htmlFor="status">Status:</label>
//                     <Form.Select
//                         id="status"
//                         value={status}
//                         onChange={handleStatusChange}
//                         className="eco-select"
//                     >
//                         <option>All Status</option>
//                         <option>Available</option>
//                         <option>Limited</option>
//                         <option>Out of Stock</option>
//                     </Form.Select>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FilterBar;

// src/pages/user/HomePage/FilterBar.jsx (updated: Car Type and Brand filters, connected to props, SearchBar with onSearch)
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/FilterBar.scss';
import SearchBar from './SearchBar';

const FilterBar = ({ onSearch, onCarTypeChange, onBrandChange, carTypes, brands, selectedCarType, selectedBrand }) => {
    const [localCarType, setLocalCarType] = useState(selectedCarType || 'All');
    const [localBrand, setLocalBrand] = useState(selectedBrand || 'All');

    const handleCarTypeChange = (e) => {
        const value = e.target.value;
        setLocalCarType(value);
        onCarTypeChange(value);
    };

    const handleBrandChange = (e) => {
        const value = e.target.value;
        setLocalBrand(value);
        onBrandChange(value);
    };

    return (
        <div className="filter-bar eco-filter">
            <div className="search-wrapper">
                <SearchBar placeholder="Search vehicle name..." onSearch={onSearch} />
            </div>
            <div className="filters-right">
                <div className="filter-group">
                    <label htmlFor="carType">Car Type:</label>
                    <Form.Select
                        id="carType"
                        value={localCarType}
                        onChange={handleCarTypeChange}
                        className="eco-select"
                    >
                        {carTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className="filter-group">
                    <label htmlFor="brand">Brand:</label>
                    <Form.Select
                        id="brand"
                        value={localBrand}
                        onChange={handleBrandChange}
                        className="eco-select"
                    >
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;