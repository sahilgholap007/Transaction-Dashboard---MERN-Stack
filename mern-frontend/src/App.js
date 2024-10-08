import React, { useEffect, useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import axios from "axios";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3); 
  const [barChartData, setBarChartData] = useState([]);
  const [soldItems, setSoldItems] = useState(0);
  const [notSoldItems, setNotSoldItems] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        console.log(`Fetching statistics for month: ${selectedMonth}`);
        const response = await axios.get(
          `http://localhost:5000/api/statistics?month=${selectedMonth}`
        );
        setTotalSales(response.data?.totalSales || 0);
        setSoldItems(response.data?.soldItems || 0);
        setNotSoldItems(response.data?.notSoldItems || 0);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBarChartData = async () => {
      try {
        console.log(`Fetching bar chart data for month: ${selectedMonth}`); // Debug log
        const response = await axios.get(
          `http://localhost:5000/api/bar-chart?month=${selectedMonth}`
        );
        setBarChartData(response.data || []);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchStatistics();
    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions Dashboard</h1>
      <div className="mb-6">
        <label className="font-bold mr-4">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))} 
          className="p-2 border border-gray-300 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Statistics
            totalSales={totalSales}
            soldItems={soldItems}
            notSoldItems={notSoldItems}
            month={selectedMonth}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <BarChart month={selectedMonth} />

          
            <PieChart
              soldItems={soldItems}
              notSoldItems={notSoldItems}
              month={selectedMonth}
            />
          </div>
          <TransactionsTable month={selectedMonth} />
        </>
      )}
    </div>
  );
}

export default App;
