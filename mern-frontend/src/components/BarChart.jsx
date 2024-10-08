import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ month }) => {
    const [data, setData] = useState([]);
    const labels = [
        '0-100', '101-200', '201-300', '301-400',
        '401-500', '501-600', '601-700', '701-800',
        '801-900', '901+'
    ];

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bar-chart?month=${month}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Fetched bar chart data:", result);

                
                const priceRangeCounts = labels.map((label, index) => {
                    const rangeStart = index * 100; 
                    const rangeData = result.find(item => item._id === rangeStart) || { count: 0 };
                    return rangeData.count;
                });

                setData(priceRangeCounts);
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
                setData(Array(10).fill(0)); 
            }
        };

        if (month) {
            fetchBarChartData(); 
        }
    }, [month]);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: `Number of Items for Month ${month}`,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)', 
                borderColor: 'rgba(75, 192, 192, 1)', 
                borderWidth: 1, 
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        scales: {
            y: {
                beginAtZero: true,
                max: 5, 
                ticks: {
                    stepSize: 1, 
                    precision: 0, 
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Bar Chart Stats for Month ${month}`,
            },
        },
    };

    return (
        <div className="p-6 bg-blue-50 rounded-lg shadow-lg w-full max-w-2xl mx-auto" style={{ height: '400px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;
