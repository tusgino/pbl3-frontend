import axios from "axios";
import axiosClient from "../api/axiosClient";

const tradeAPI = {
    getAllTradeDetailByFiltering(params, token) {
        const url = '/private/TradeDetail/Get-all-tradedetail-by-filtering';
        const config = {
            headers : {
                'Authorization' : `Bearer ${token}`,        
            }
        }
        return axiosClient.get(url, {params});
    },
    updateUser(params, token) {
        const url = `/private/TradeDetail/${params.id}`;
        const config = {
          headers: {
            'Content-Type' : 'application/json-patch+json',
            'Authorization': `Bearer ${token}`,
          }
        }
        return axiosClient.patch(url, params.patchDoc, config);
      },
}

export default tradeAPI;