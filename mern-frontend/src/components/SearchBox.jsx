import React from 'react';

const SearchBox = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            placeholder="Search transactions..."
            className="border border-gray-300 p-2 rounded-md w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
};

export default SearchBox;
