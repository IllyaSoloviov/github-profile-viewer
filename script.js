document.addEventListener("DOMContentLoaded", function() {
    let profilePage = document.getElementById("profile");
    let chartPage = document.getElementById("chartPage");
    let profile_info = document.getElementById("profile_info");
    let profile_chart = document.getElementById("profile_chart");
    chartPage.addEventListener("click", function() {
        if (profilePage.classList.contains("active")) {
            profilePage.classList.remove("active");
            chartPage.classList.add("active");

            profile_info.style.display = "none";
            profile_chart.style.display = "flex";

        }
    })
    profilePage.addEventListener("click", function() {
        if (chartPage.classList.contains("active")) {
            chartPage.classList.remove("active");
            profilePage.classList.add("active");

            profile_info.style.display = "grid";
            profile_chart.style.display = "none";

        }
    })
})


const searchBtn = document.getElementById("searchButton");
let profile_info = document.getElementById("profile_info");
const GITHUB_TOKEN = 'ghp_...';
const weekButton = document.getElementById("weakButton");

let chartInstance = null;

searchBtn.addEventListener("click", function(e) {
    e.preventDefault();

    let userLogin = document.getElementById("searchInput").value;
    profile_info.innerHTML = `
    <div class="skeleton-grid1 skeleton-box"></div>
    <div class="skeleton-grid2 skeleton-box"></div>
    <div class="skeleton-grid3 skeleton-box"></div>
    <div class="skeleton-grid4 skeleton-box"></div>
    <div class="skeleton-grid5 skeleton-box"></div>
    <div class="skeleton-grid6 skeleton-box"></div>
    <div class="skeleton-grid7 skeleton-box"></div>
    <div class="skeleton-grid8 skeleton-box"></div>`;
    console.log(userLogin);
    fetch(`https://api.github.com/users/${userLogin}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error!");
            }
            return response.json();
        })
        .then((json) => {
            console.log(json);
        profile_info.innerHTML = `
        <div class="grid1"><img src="${json.avatar_url}" alt="avatar"></div>
        <div class="grid2"> ${json.followers} <span>followers</span> | ${json.following} <span>following</span> </div>
        <div class="grid3"><span>Name: </span>${json.name}</div>
        <div class="grid4"><span>Login: </span>${json.login}</div>
        <div class="grid5"><span>Url to GitHub: </span><a href="${json.html_url}">${json.html_url}</a></div>
        <div class="grid6"><span>Blog:</span> ${json.blog ? `<a href="${json.blog}" target="_blank">${json.blog}</a>` : '******'}</div>
        <div class="grid7"><span>City: </span>${json.location}</div>
        <div class="grid8"><span>Email: </span>${json.email ? `<a href="${json.email}" target="_blank">${json.email}</a>` : '******'}</div>
        `
        }).catch(error => {
        console.error(error.message);
        profile_info.innerHTML = `
            <div class="errorMes"><span>Користувача</span> не знайдено<span>⚠️</span></div>
        `;
    });
    const startDate1 = document.getElementById("weak1").value;
    const startDate2 = document.getElementById("weak2").value;

    compareTwoWeeks(userLogin, GITHUB_TOKEN, startDate1, startDate2);
})

weekButton.addEventListener("click", function () {
    const startDate1 = document.getElementById("weak1").value;
    const startDate2 = document.getElementById("weak2").value;
    const userLogin = document.getElementById("searchInput").value;

    if (!userLogin) return;

    compareTwoWeeks(userLogin, GITHUB_TOKEN, startDate1, startDate2);
});

function compareTwoWeeks(userName, gitHubToken, startDate1, startDate2) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const query = `
      query {
        user(login: "${userName}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${gitHubToken}`
        },
        body: JSON.stringify({ query })
    })
        .then(res => res.json())
        .then(data => {
            const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
            const allDays = weeks.flatMap(week => week.contributionDays);

            const getWeekData = (startDate) => {
                const startIndex = allDays.findIndex(day => day.date === startDate);
                if (startIndex === -1 || startIndex + 7 > allDays.length) {
                    throw new Error(`Еще нет 7 дней начиная с ${startDate}`);
                }
                return allDays.slice(startIndex, startIndex + 7).map(day => day.contributionCount);
            };

            const week1 = getWeekData(startDate1);
            console.log(week1)
            const week2 = getWeekData(startDate2);
            console.log(week2)

            return { week1, week2 };
        })
        .then(({ week1, week2 }) => {
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                    datasets: [
                        {
                            label: `From ${startDate1}`,
                            data: week1,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 0.6)',
                            borderWidth: 4,
                            tension: 0.3
                        },
                        {
                            label: `From ${startDate2}`,
                            data: week2,
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            borderColor: 'rgba(153, 102, 255, 0.6)',
                            borderWidth: 4,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
}
