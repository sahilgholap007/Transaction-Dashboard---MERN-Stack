import React from 'react';

const Navbar = ({ month, setMonth }) => {
    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">Transaction Dashboard</h1>
                <select
                    className="border border-gray-300 p-2 rounded-md"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>
        </nav>
    );
};

export default Navbar;
