import React, { useEffect, useState } from 'react';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            // Check if the month is defined before making the API call
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/statistics?month=${month}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                setStatistics({ totalSales: 0, soldItems: 0, notSoldItems: 0 }); 
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [month]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Transaction Statistics for Month {month}</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded shadow">
                    <h3 className="font-bold">Total Sales</h3>
                    <p>{statistics.totalSales ? statistics.totalSales.toFixed(2) : 0} $</p>
                </div>
                <div className="p-4 bg-green-100 rounded shadow">
                    <h3 className="font-bold">Total Sold Items</h3>
                    <p>{statistics.soldItems || 0}</p>
                </div>
                <div className="p-4 bg-red-100 rounded shadow">
                    <h3 className="font-bold">Total Not Sold Items</h3>
                    <p>{statistics.notSoldItems || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
