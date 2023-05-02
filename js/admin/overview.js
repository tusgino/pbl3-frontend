import courseAPI from "./courseAPI";
import tradeAPI from "./tradeAPI";
import userAPI from "./userAPI";

const token = localStorage.getItem('token')

const SystemRevenue = async(data) => {
    const title = document.getElementById('systemrevenue-title');
    const now = new Date();
    console.log(now);
    title.textContent = `Doanh thu hệ thống năm ${now.getFullYear()} (VND)`;
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const revenue = [];
    var totalrevenuecurrentyear = 0;
    data.forEach((element) => {
        // months.push(element.month);
        revenue.push(element.revenue);
        totalrevenuecurrentyear += element.revenue;
    });


    // tong doanh thu hien tai
    {
        const totalrevenue = document.getElementById('TotalRevenueCurrentYear');
        totalrevenue.textContent = totalrevenuecurrentyear;
    }
    //

    // ti le tang truong
    {
        const oldrevenue = document.getElementById('oldrevenue').textContent;
        const growthrate = document.getElementById('growthrate');
        growthrate.textContent =  Math.floor(totalrevenuecurrentyear/oldrevenue * 100)  + '%';
    }

    // chiet khau trung binh
    {
        const avgfee = document.getElementById('avg-fee');
        avgfee.textContent = await courseAPI.getAverageFeePercent({}, token);
    }

    // khoa hoc tieu bieu
    {
        const procourse = document.getElementById('pro-course');
        const data = await courseAPI.getBestCourses({}, token);
        procourse.textContent = data[0];
    }
    //
    

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
        const beststudents  = await userAPI.getBestStudents({}, token);
        console.log(beststudents);
        const prostudent = document.getElementById('pro-student');

        beststudents.forEach((student) => {
            const liElement = document.createElement('li');
            liElement.classList.add('mt-3')
            liElement.innerHTML = `<i class="fas fa-graduation-cap"></i> ${student.name}`;
            prostudent.appendChild(liElement)
        })
    }
    //

    // chuyên gia tiêu biểu
    {
        const bestexperts = await userAPI.getBestExperts({}, token);
        
        const proexpert = document.getElementById('pro-expert');

        bestexperts.forEach((expert) => {
            const liElement = document.createElement('li');
            liElement.classList.add('mt-3')
            liElement.innerHTML = `<i class="fab fa-black-tie"></i> ${expert.name}`;
            proexpert.appendChild(liElement)
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
    const revenue = await tradeAPI.getSystemRevenue({}, token);
    console.log(revenue)
    SystemRevenue(revenue);

    const users = await userAPI.getAllUsersByType({}, token);
    console.log(users);
    AllOfUsers(users);

})()