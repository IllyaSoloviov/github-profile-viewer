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

            profile_info.style.display = "flex";
            profile_chart.style.display = "none";

        }
    })
})


const searchBtn = document.getElementById("searchButton");
let profile_info = document.getElementById("profile_info");

searchBtn.addEventListener("click", function(e) {
    e.preventDefault();

    let userLogin = document.getElementById("searchInput").value;
    console.log(userLogin);
    fetch(`https://api.github.com/users/${userLogin}`)
        .then(response => {
           return  response.json()
        })
        .then((json) => {
            console.log(json);
        profile_info.innerHTML = `
        <img src="${json.avatar_url}" alt="avatar">
        `
        })
})
