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
    return axiosClient.get(url);
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
  },
  addDegree(data, token) {
    const url = '/Degree/Add-degree';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    return axiosClient.post(url, data, config);
  },
  updateDegree(id, data, token) {
    const url = `/Degree/Update-degree/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      }
    }
    return axiosClient.patch(url, data, config);
  },
}

export default expertAPI;
