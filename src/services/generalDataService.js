const Cep = require("../models/CepModel");
const Banks = require("../models/BanksModel");

const getAllCitiesAndStates = async () => {
    try {
        const cities = await Cep.findAll({
            attributes: ["city", "state"],
            raw: true
        });

        // Agrupar estados e cidades no formato desejado
        const result = {};
        cities.forEach(({ state, city }) => {
            if (!result[state]) {
                result[state] = [];
            }
            result[state].push(city);
        });

        return result;
    } catch (error) {
        throw new Error(error.message || "Erro ao buscar cidades e estados");
    }
};

const getBanksContainLawsuits = async () => {
    try {
        const banks = await Banks.findAll({
            attributes: ["name", "code"],
            raw: true
        });

        banks.sort((a, b) => a.name.localeCompare(b.name));

        return banks;
    } catch (error) {
        throw new Error(error.message || "Erro ao buscar os bancos que contém processos judiciais");
    }
};

module.exports = { getAllCitiesAndStates, getBanksContainLawsuits };
