import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ soldItems, notSoldItems, month }) => {
    const data = {
        labels: ['Sold Items', 'Not Sold Items'],
        datasets: [
            {
                data: [soldItems, notSoldItems],
                backgroundColor: ['#42A5F5', '#FF7043'], 
                hoverBackgroundColor: ['#64B5F6', '#FF8A65'], 
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };

    return (
        <div className="p-4 bg-blue-50 rounded-lg shadow-lg w-full max-w-md mx-auto"> 
            <h3 className="text-center text-lg font-bold mb-4">Sales Distribution for Month {month}</h3>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
