import { setTextContent, showModal, showNotication } from "../utils";
import tradeAPI from "./tradeAPI";
import systemAPI from "./system";
import userAPI from "./userAPI";
import { ReloadOverview } from "./overview";
import { ReloadAnalytics } from "./analytics";

const token = localStorage.getItem('token');

const createRecord_Trade = (data) => {
    if(!data) return;

    const tradeRecord = document.getElementById('tradeManageRecord');
    if(!tradeRecord) return;

    const record = tradeRecord.content.cloneNode(true);
    if(!record) return;

    if(data.typeOfTrade == 0) setTextContent(record, '[data-id="typeoftrade-trademanage"]', "Mua khoá học");
    else if(data.typeOfTrade == 1) setTextContent(record, '[data-id="typeoftrade-trademanage"]', "Duy trì tài khoản");
    setTextContent(record, '[data-id="balance-trademanage"]', data.balance);
    const dateoftrade = new Date(data.dateOfTrade);
    setTextContent(record, '[data-id="dateoftrade-trademanage"]', dateoftrade.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-'));
    if(data.tradeStatus == 1) setTextContent(record, '[data-id="tradestatus-trademanage"]', 'Thành công');
    else if(data.tradeStatus == 0) setTextContent(record, '[data-id="tradestatus-trademanage"]', 'Đang chờ');
    else if(data.tradeStatus == -1) setTextContent(record, '[data-id="tradestatus-trademanage"]', 'Thất bại');

    const detailtradetype = document.getElementById('detail-tradetype');
    const detailtradeuser = document.getElementById('detail-tradeuser');
    const detailtradebalance = document.getElementById('detail-tradebalance');
    const detailtradeprice = document.getElementById('detail-tradeprice');
    const detailtradedate = document.getElementById('detail-tradeDate');
    const detailtradestatus = document.getElementById('detail-tradestatus');
    const btnconfirmtrade = document.getElementById('btn-confirmtrade');
    const btnrefusetrade = document.getElementById('btn-refusetrade');

    const iconinfo = record.getElementById('trademanage-iconinfo');

    iconinfo.addEventListener('click', () => {
        if(data.typeOfTrade == 0) detailtradetype.value = "Mua khoá học";
        else if(data.typeOfTrade == 1) detailtradetype.value = "Duy trì tài khoản";
        detailtradeuser.value = data.user.name;
        detailtradebalance.value = data.balance;
        detailtradeprice.value = data.requiredBalance;
        detailtradedate.value = dateoftrade.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');
        if(data.tradeStatus == 1) detailtradestatus.value = "Thành công";
        else if(data.tradeStatus == 0) detailtradestatus.value = "Đang chờ";
        else if(data.tradeStatus == -1) detailtradestatus.value = "Thất bại";

        if(data.tradeStatus == 0) {
            btnconfirmtrade.style.display = 'block';
            btnrefusetrade.style.display = 'block';
        } else {
            btnconfirmtrade.style.display = 'none';
            btnrefusetrade.style.display = 'none';
        }

        console.log(data);
        btnconfirmtrade.value = data.idTrade;
        btnrefusetrade.value = data.idTrade;
    })
    return record;
}

const setEventHandlerAcc = () => {
    const btnconfirmtrade = document.getElementById('btn-confirmtrade');
    const btnrefusetrade = document.getElementById('btn-refusetrade');

    btnconfirmtrade.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/TradeStatus",
            "op": "replace",
            "value": 1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await tradeAPI.updateTrade(params, token)) {
            const trade = await tradeAPI.getTradeByID({id: event.target.value}, token);
            if(!trade) return;
            const data = {
                idUser : trade.idUser,
                subject : "Thông báo từ THH Online Course",
                body : "Giao dịch của bạn đã được xác nhận thành công",
            }
            userAPI.sendMail(data, token);
            showNotication("Cập nhật thành công");
        }
        getTrade(1);
        ReloadOverview();
        ReloadAnalytics();
    });
    btnrefusetrade.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/TradeStatus",
            "op": "replace",
            "value": -1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await tradeAPI.updateTrade(params, token)) {
            const data = {
                idUser : event.target.value,
                subject : "Thông báo từ THH Online Course",
                body : "Giao dịch của bạn đã bị từ chối",
            }
            userAPI.sendMail(data, token);
            showNotication("Cập nhật thành công");
        }
        getTrade(1);
        ReloadOverview();
        ReloadAnalytics();
    });
}


const getTrade = async(page) => {
    const params = {
        "is_purchase" : document.getElementById('btnchecktrue-tradetype1').checked,
        "is_rent" : document.getElementById('btnchecktrue-tradetype2').checked,
        "is_success" : document.getElementById('btnchecktrue-tradestatus').checked,
        "is_pending" : document.getElementById('btncheckwait-tradestatus').checked,
        "is_failed" : document.getElementById('btncheckfalse-tradestatus').checked,
        "start_date" : document.getElementById('datetrade-from').value,    
        "end_date" : document.getElementById('datetrade-to').value,
        "start_balance" : !isNaN(parseInt(document.getElementById('txtbalance-from').value)) ? document.getElementById('txtbalance-from').value : (document.getElementById('txtbalance-from').value == "" ? document.getElementById('txtbalance-from').value : 999999999999999),
        "end_balance" : !isNaN(parseInt(document.getElementById('txtbalance-to').value)) ? document.getElementById('txtbalance-to').value : (document.getElementById('txtbalance-to').value == "" ? document.getElementById('txtbalance-to').value : 0),
        "page" : page,
    };

    const {data : {_data, _totalRows}} = await tradeAPI.getAllTradeDetailByFiltering(params, token);

    systemAPI.renderRecord(_data, 'quanligiaodich', createRecord_Trade);
    systemAPI.renderPagination(_totalRows, 'quanligiaodich', getTrade, page)
}

const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-trademanage');
    btnsearch.addEventListener('click', () => {
        getTrade(1);
    })
}

(async() => {
    try {

        setEventSearch();
    
        setEventHandlerAcc();

        getTrade(1);

    } catch (error) {
        console.log(error);
    }
})()