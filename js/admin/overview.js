import tradeAPI from "./tradeAPI";
import userAPI from "./userAPI";

const token = localStorage.getItem('token')

const SystemRevenue = (data) => {
    const title = document.getElementById('systemrevenue-title');
    const now = new Date();
    console.log(now);
    title.textContent = `Doanh thu hệ thống năm ${now.getFullYear()} (VND)`;
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const revenue = [];
    data.forEach((element) => {
        // months.push(element.month);
        revenue.push(element.revenue);
    });

    


    new Chart(document.getElementById('SystemRevenue'), 
    {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Doanh thu hệ thống',
                data: revenue,
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
            },
            plugins : {
                legend : {
                    display : false,
                }
            }
        }
    });
}

const AllOfUsers = async (data) => {
    
    const typesofuser = ['Quản trị viên', 'Chuyên gia', 'Học viên'];

    new Chart(document.getElementById('AllOfUsers'),
    {
        type: 'doughnut',
        data: {
            labels: typesofuser,
            datasets: [
                {
                    label: "Số lượng",
                    backgroundColor : [
                        'rgb(39, 49, 103)',
                        'rgb(82, 113, 255)',
                        'rgb(56, 182, 255)'
                    ],
                    data: data.map(row => row.number),
                    borderWidth: 1
                },
            ]
        },
        options: {  
            scales: {
                y: {
                beginAtZero: true
                }
            },
            datasets : {
                label: screenLeft,
                screen : {
                    display : false,
                }
            },
        }
    });   




    // tổng lượng người dùng
    var totalUsers = 0;
    data.forEach((element) => {
        totalUsers += element.number;
    })
    document.getElementById('totalusers').textContent = totalUsers;
    //


    // học viên tiêu biểu
    {
        const params = {
            "page" : 1,
        };
        console.log(await userAPI.getAllExpertsForAnalytics(params, token));
        const {data : {_data, _totalRows}} = await userAPI.getAllStudentsForAnalytics(params, token);
        console.log(_data)
        const prostudent = document.getElementById('pro-student');
        var coursecount = 0;
        _data.forEach((student) => {
            if(student.finished_courses_count > coursecount) {
                prostudent.textContent = student.student_name; 
                coursecount = student.finished_courses_count;
            }
        })
    }
    //

    
    


    // chuyên gia tiêu biểu
    {
        const params = {
            "page" : 1,
        };
        const {data : {_data, _totalRows}} = await userAPI.getAllExpertsForAnalytics(params, token);
        const proexpert = document.getElementById('pro-expert');
        var revenuecount = 0;
        _data.forEach((expert) => {
            if(expert._revenue > revenuecount) {
                proexpert.textContent = expert._expert_name;
                revenuecount = expert._revenue;
            }
        })
    }
    //


    // new users
    {
        const newuserspanel = document.getElementById('newuserpanel');
        const newusers = await userAPI.getNewUsers({}, token);
        const ulElement = document.createElement('ul');
        ulElement.classList.add('vstack');
        ulElement.classList.add('gap-4');
        newusers.forEach((user) => {
            const liElement = document.createElement('li');
            liElement.innerHTML = `<i class=\"far fa-user\"></i> ${user}`;
            ulElement.appendChild(liElement);
        })
        newuserspanel.appendChild(ulElement);
    }
    //






}


(async() => {
    const revenue = await tradeAPI.getSystemRevenue();
    console.log(revenue)
    SystemRevenue(revenue);

    const users = await userAPI.getAllUsersByType();
    console.log(users);
    AllOfUsers(users);
    
    
    


    
})()