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


