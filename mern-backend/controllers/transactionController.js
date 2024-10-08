const Transaction = require('../models/Transaction');
const fetchDataFromAPI = require('../utils/fetchData');


const initializeDatabase = async (req, res) => {
    const data = await fetchDataFromAPI();
    try {
        await Transaction.deleteMany({});
        await Transaction.insertMany(data);
        res.status(201).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
};


const getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const searchQuery = search
        ? { $or: [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] }
        : {};

    try {
        const transactions = await Transaction.find(searchQuery)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const count = await Transaction.countDocuments(searchQuery);
        res.json({ transactions, totalPages: Math.ceil(count / perPage), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};


const getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        const monthNumber = parseInt(month);

        if (monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: "Invalid month. Please provide a month between 1 and 12." });
        }

        const totalSales = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" },
                    totalSold: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } }
                }
            }
        ]);

        const soldItems = await Transaction.find({
            sold: true,
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }
        });

        const notSoldItems = await Transaction.find({
            sold: false,
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }
        });

        res.json({
            totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
            soldItems: soldItems.length,
            notSoldItems: notSoldItems.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error getting data', error });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.query;
    const monthNumber = parseInt(month);

    try {
        const priceRanges = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber]
                    }
                }
            },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "901-above",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};


const getPieChartData = async (req, res) => {
    const { month } = req.query;
    const monthNumber = parseInt(month);

    try {
        const categoryData = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber]
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    itemCount: { $sum: 1 }
                }
            }
        ]);

        res.json(categoryData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};


const getCombinedData = async (req, res) => {
    try {
        const statisticsResponse = await getStatistics(req, res);
        const barChartResponse = await getBarChartData(req, res);
        const pieChartResponse = await getPieChartData(req, res);

        res.json({
            statistics: statisticsResponse,
            barChart: barChartResponse,
            pieChart: pieChartResponse
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error });
    }
};

module.exports = {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};
