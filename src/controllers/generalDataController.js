const generalDataService = require("../services/generalDataService");

const getCitiesAndStates = async (req, res) => {
    try {
        const data = await generalDataService.getAllCitiesAndStates();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBanksContainLawsuits = async (req, res) => {
    try {
        const data = await generalDataService.getBanksContainLawsuits();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getCitiesAndStates, getBanksContainLawsuits };