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
    updateTrade(params, token) {
        const url = `/private/TradeDetail/Update-trade-by-${params.id}`;
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