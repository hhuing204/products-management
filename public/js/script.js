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

// //detect browser or tab closing
// window.addEventListener("beforeunload", function(e) {
//     socket.emit("CLIENT_CLOSE_WEB", "ss")
// })
// //end detect