//show alert
const showAlert = document.querySelector("[show-alert]")
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closerAlert = showAlert.querySelector("[close-alert]")


    setTimeout(()=> {
        showAlert.classList.add("alert-hidden")
    }, time) 
    closerAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}


//show alert