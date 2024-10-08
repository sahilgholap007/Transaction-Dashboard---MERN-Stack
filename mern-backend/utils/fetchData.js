const axios = require('axios');

const fetchDataFromAPI = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

module.exports = fetchDataFromAPI;
