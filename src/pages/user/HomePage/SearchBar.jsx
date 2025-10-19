// // src/pages/HomePage/SearchBar.jsx
// import React from 'react';
// import { Form } from 'react-bootstrap';
// import '../../../styles/SearchBar.scss';

// const SearchBar = ({ placeholder }) => {
//     return (
//         <div className="search-bar eco-search">
//             <Form.Control
//                 type="text"
//                 placeholder={placeholder}
//                 className="eco-input"
//             />
//         </div>
//     );
// };

// export default SearchBar;

// src/pages/user/HomePage/SearchBar.jsx (updated: connected onSearch prop for real-time filtering)
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/SearchBar.scss';

const SearchBar = ({ placeholder, onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value); // Call parent onSearch immediately for real-time search
        }
    };

    return (
        <div className="search-bar eco-search">
            <Form.Control
                type="text"
                placeholder={placeholder}
                className="eco-input"
                value={searchValue}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;