import axios from "axios";
import axiosClient from "../api/axiosClient";

const tradeAPI = {
    getAllTradeDetailByFiltering(params, token) {
        const url = '/private/TradeDetail/Get-all-tradedetail-by-filtering';
        const config = {
          params,
            headers : {
                'Authorization' : `Bearer ${token}`,        
            }
        }
        return axiosClient.get(url, config);
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
      getSystemRevenue(params, token) {
        const url = '/private/TradeDetail/Get-system-revenue';
        const config = {
          params,
          headers: {
            'Authorization' : `Bearer ${token}`,
          },
        }
        return axiosClient.get(url, config);
      }
}

export default tradeAPI;