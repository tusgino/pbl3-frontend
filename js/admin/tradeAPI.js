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
}

export default tradeAPI;