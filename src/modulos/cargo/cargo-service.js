import Axios from '../../services/Axios';
const axios = Axios({
    baseAddress: `http://localhost:5000/api/`
})

const obterCargos = async ({ page, pageSize, term }) => {
    const paged = await axios.get(`cargos?page=${page}&pageSize=${pageSize}&term=${term}`)
    return paged;
}
const obterCargo = async (cargoId) => {
    const paged = await axios.get(`cargos/${cargoId}`)
    return paged;
}
const excluirCargo = async (cargoId) => {
    const response = await axios.delete(`cargos/${cargoId}`);
    return response;
}

const incluirCargo = async (formData) => {
    const response = await axios.post(`cargos`, formData);
    return response;
}

const atualizarCargo = async (cargoId, formData) => {
    const response = await axios.put(`cargos/${cargoId}`, formData);
    return response;
}

export {
    atualizarCargo,
    excluirCargo,
    incluirCargo,
    obterCargo,
    obterCargos
};
