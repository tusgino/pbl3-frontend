import accountAPI from "../api/accountAPI";
import { setEventHandlerChart } from "./analytics";
import courseAPI from "./courseAPI";
import tradeAPI from "./tradeAPI";
import userAPI from "./userAPI";

const token = localStorage.getItem('token')

const SystemRevenue = async (data) => {
    const title = document.getElementById('systemrevenue-title');
    const now = new Date();
    console.log(now);
    title.textContent = `Doanh thu hệ thống năm ${now.getFullYear()} (VND)`;

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const revenue = [];
    for (let i = 0; i < now.getMonth(); i++) revenue.push(0);

    var totalrevenuecurrentyear = 0;
    var lastyearrevenue = 5000000;
    data.forEach((element) => {
        revenue[element.month - 1] = element.revenue;
        totalrevenuecurrentyear += element.revenue;
    });


    var systemrevenuechart = Chart.getChart('SystemRevenue');
    if (systemrevenuechart != null) systemrevenuechart.destroy();
    systemrevenuechart = new Chart(document.getElementById('SystemRevenue'),
        {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Doanh thu',
                    data: revenue,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                },
                datasets: {
                    label: screenLeft,
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });

    //set toggle icon
    {
        const toggleicon = document.getElementById('toggle-chart-systemrevenue');
        toggleicon.value = revenue;
        toggleicon.label = 'Doanh thu';
        setEventHandlerChart('SystemRevenue', 'toggle-chart-systemrevenue')
    }

    // tong doanh thu hien tai
    {
        const totalrevenue = document.getElementById('TotalRevenueCurrentYear');
        totalrevenue.textContent = totalrevenuecurrentyear + " VND";
    }
    //

    // doanh thu nam truoc 
    {
        const oldrevenue = document.getElementById('LastYearRevenue');
        oldrevenue.textContent = lastyearrevenue + " VND";
    }
    //

    // ti le tang truong
    {
        const growthrate = document.getElementById('growthrate');
        growthrate.textContent = Math.floor(totalrevenuecurrentyear / lastyearrevenue * 100) + ' %';
    }

    // chiet khau trung binh
    {
        const avgfee = document.getElementById('avg-fee');
        avgfee.textContent = await courseAPI.getAverageFeePercent({}, token) + " %";
    }

    // khoa hoc tieu bieu
    {
        const procourse = document.getElementById('pro-course');
        const data = await courseAPI.getBestCourses({}, token);
        procourse.textContent = data[0];
    }
    //


}

const AllOfUsers = async (data) => {
    console.log(data)
    const typesofuser = ['Quản trị viên', 'Chuyên gia', 'Học viên'];

    var allofuserschart = Chart.getChart('AllOfUsers');
    if (allofuserschart != null) allofuserschart.destroy();
    allofuserschart = new Chart(document.getElementById('AllOfUsers'),
        {
            type: 'doughnut',
            data: {
                labels: typesofuser,
                datasets: [
                    {
                        label: "Số lượng",
                        backgroundColor: [
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
                datasets: {
                    label: screenLeft,
                    screen: {
                        display: false,
                    }
                },
            }
        });

    // tổng lượng người dùng
    var totalUsers = 0;
    data.forEach((element) => {
        totalUsers += element.number;
    })
    document.getElementById('totalusers').textContent = totalUsers + " người";
    //


    // học viên tiêu biểu
    {
        const beststudents = await userAPI.getBestStudents({}, token);
        console.log(beststudents);
        const prostudent = document.getElementById('pro-student');
        prostudent.textContent = "";
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
        proexpert.textContent = "";
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
        newuserspanel.textContent = "";

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

    // Tỉ lệ học viên
    {
        const studentrate = document.getElementById('studentrate');
        studentrate.textContent = Math.round(data[2].number / totalUsers * 100) + " %"
    }
    //

    //Tỉ lệ chuyên gia
    {
        const expertrate = document.getElementById('expertrate');
        expertrate.textContent = Math.round(data[1].number / totalUsers * 100) + " %"
    }
    //

}

const OverviewCourse = async (data) => {
    console.log(data);

    var myChart = Chart.getChart('OverviewCourse');
    if (myChart != null) myChart.destroy();

    var numofcourse = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.forEach((group) => {
        numofcourse[group.month - 1] = group.numOfCourses;
    })

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    myChart = new Chart(document.getElementById('OverviewCourse'),
        {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Số lượng đăng tải',
                    data: numofcourse,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                },
                datasets: {
                    label: screenLeft,
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });

    // set toggle icon 
    {
        const toggleicon = document.getElementById('toggle-chart-overviewcourse');
        toggleicon.value = numofcourse;
        toggleicon.label = 'Số lượng đăng tải';
        setEventHandlerChart('OverviewCourse', 'toggle-chart-overviewcourse');
    }


    const overview = await courseAPI.getOverviewCourse({}, token);
    //total course 
    {
        const totalCourse = document.getElementById('TotalCourse');
        totalCourse.textContent = overview.totalCourse + " khoá";
    }

    //avg upload
    {
        const avgupload = document.getElementById('AvgUploadByMonth');
        avgupload.textContent = Math.round(overview.totalCourse / 12) + " khoá/tháng";
    }

    // best sales course 
    {
        const bestSaleCourse = document.getElementById('BestSales');
        bestSaleCourse.textContent = overview.bestSaleCourse;
    }

    //most upload 
    {
        const mostupload = document.getElementById('MostUpload');
        mostupload.textContent = overview.mostUpload;
    }

    //avg rate
    {
        const stars = document.createElement('ul');
        stars.classList.add('hstack');
        for (var i = 0; i < overview.avgrate; i++) {
            const star = document.createElement('li');
            star.innerHTML = `<i class="fas fa-star" style="color: #fff000;"></i>`;
            stars.appendChild(star);
        }
        for (var i = overview.avgrate; i < 5; i++) {
            const fadestar = document.createElement('li');
            fadestar.innerHTML = `<i class="fas fa-star" style="color: #bfbfbf;"></i>`;
            stars.appendChild(fadestar);
        }
        const ratezone = document.getElementById('avg-rate');
        ratezone.textContent = "";
        ratezone.appendChild(stars);
    }



}

(async () => {

    const imgs = document.querySelectorAll('.avatar');
    console.log(imgs)
    imgs.forEach((img) => {
        img.src = "https://media.istockphoto.com/id/1307140502/vi/vec-to/vector-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-h%E1%BB%93-s%C6%A1-ng%C6%B0%E1%BB%9Di-d%C3%B9ng-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-ch%C3%A2n-dung-avatar-logo-k%C3%BD-t%C3%AAn-ng%C6%B0%E1%BB%9Di-h%C3%ACnh-d%E1%BA%A1ng.jpg?s=612x612&w=0&k=20&c=yCpEW0XGq3LCgCn-0GupWknu4pIYxEm8CigGHnqVkQU=";
    })

    const avatar = document.querySelector('.sidebar .avatar');
    const username = document.getElementById('sidebar-user-name');
    // const userdesc = document.getElementById('sidebar-user-desc');

    const token = localStorage.getItem('token');
    try {
        const res = await accountAPI.checkToken({ "token": token });
        console.log(res);
        if (res.success) {
            const data = await userAPI.getByID({ id: res.data.idUser }, token);
            console.log(data)
            avatar.src = data.data.avatar;
            username.textContent = data.data.name;
        }
    } catch (error) {
        console.log(error);
    }

    const sidebaritems = document.querySelectorAll('.sidebaritem');
    if (!sidebaritems) return;

    sidebaritems.forEach((sidebaritem) => {
        sidebaritem.addEventListener('click', () => {
            const activesidebaritems = document.querySelectorAll('.sidebaritem');
            activesidebaritems.forEach((item) => {
                item.classList.remove("active");
            })
            sidebaritem.className += ' active'
        });
    })


    const revenue = await tradeAPI.getSystemRevenue({}, token);
    console.log(revenue)
    SystemRevenue(revenue);

    const users = await userAPI.getAllUsersByType({}, token);
    console.log(users);
    AllOfUsers(users);

    const numofcourse = await courseAPI.getNumOfCourseByMonth({ 'year': 2023 }, token);
    console.log(numofcourse);
    OverviewCourse(numofcourse);

})()


const handleSystemRevenue = async () => {
    const revenue = await tradeAPI.getSystemRevenue({}, token);
    console.log(revenue)
    SystemRevenue(revenue);
}

const handleAllOfUsers = async () => {
    const users = await userAPI.getAllUsersByType({}, token);
    console.log(users);
    AllOfUsers(users);
}

const handleOverviewCourse = async () => {
    const numofcourse = await courseAPI.getNumOfCourseByMonth({ 'year': 2023 }, token);
    console.log(numofcourse);
    OverviewCourse(numofcourse);
}

export const ReloadOverview = () => {
    handleSystemRevenue();
    handleAllOfUsers();
    handleOverviewCourse();
}

