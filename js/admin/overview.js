import userAPI from "./userAPI";

const SystemRevenue = (data) => {
    const ctx = document.getElementById('SystemRevenue');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.month,
            datasets: [{
                label: 'Doanh thu hệ thống',
                data: data.revenue,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            },
            datasets : {
                label: screenLeft,
            }
        }
    });
}
(async() => {
    const revenue = await userAPI.getSystemRevenue();
    SystemRevenue(revenue.data);
})()