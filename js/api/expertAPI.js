import axiosClient from "./axiosClient";

export const expertAPI = {
  getBankingByID(params, token) {
    const url = `/BankInfo/Get-By-IdBankInfo`;
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  getDegreeByIDUser(idUser, token) {
    const url = `/Degree/${idUser}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  getDegreeByIDDgree(idDegree, token) {
    const url = `/Degree/getByID/${idDegree}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  updateBanking(id, data, token) {
    const url = `/BankInfo/Update-BankInfo/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      }
    }
    return axiosClient.patch(url, data, config);
  },
  postBanking(params, token) {
    const url = '/BankInfo/Add-BankInfo';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.post(url, params, config);
  }
}

export default expertAPI;
