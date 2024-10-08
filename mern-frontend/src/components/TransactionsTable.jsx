import React, { useEffect, useState } from 'react';

const TransactionTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/transactions?month=${month}&search=${searchTerm}&page=${currentPage}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched transactions:", data);

                if (data && Array.isArray(data.transactions)) {
                    setTransactions(data.transactions);
                } else {
                    console.error("Expected an array for transactions, but got:", data);
                    setTransactions([]); 
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [month, searchTerm, currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Transactions for Month {month}</h2>
            <input
                type="text"
                placeholder="Search Transactions"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="border border-gray-300 rounded p-2 mb-4"
            />
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Title</th>
                        <th className="border border-gray-300 p-2">Description</th>
                        <th className="border border-gray-300 p-2">Price</th>
                        <th className="border border-gray-300 p-2">Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}> 
                            <td className="border border-gray-300 p-2">{transaction.title}</td>
                            <td className="border border-gray-300 p-2">{transaction.description}</td>
                            <td className="border border-gray-300 p-2">{transaction.price}</td>
                            <td className="border border-gray-300 p-2">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="bg-gray-300 p-2 rounded">Previous</button>
                <button onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-300 p-2 rounded">Next</button>
            </div>
        </div>
    );
};

export default TransactionTable;
