//refuse friend
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend")
        socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
}
//accept friend
const acceptFriends = (button) =>{
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend")
        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
}


//request
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach( button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend")
            

            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
//end request

//cancel request
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if(listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach( button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")
            
            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
//end cancel request

//delete request
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach( button => {
        refuseFriend(button)
    })
}
//end delete request

//accept request
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach( button => {
        acceptFriends(button)
    })
}
//end accept request

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]")
if(badgeUsersAccept){
    const userId = badgeUsersAccept.getAttribute("badge-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if(userId == data.userId){
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends
        }
    })
}




// end SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //accept page
    const dataUserAccept = document.querySelector("[data-users-accept]")
    if(dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-users-accept")
        // console.log(userId)
        if(userId == data.userId){
        
            const div = document.createElement("div")
            div.classList.add("col-6")
            div.setAttribute("user-id", data.infoUserA._id)
    
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="/images/avatar.png" alt=${data.infoUserA.fullName}>
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-buttons">
                            <button 
                                class="btn btn-sm btn-primary mr-1"
                                btn-accept-friend 
                                data-id=${data.infoUserA._id}
                            >
                                Chấp nhận
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1"
                                btn-refuse-friend 
                                data-id=${data.infoUserA._id}
                            >
                                Xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1"
                                btn-deleted-friend=""
                                disabled=""
                            >
                                Đã xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-primary mr-1"
                                btn-accepted-friend
                                disabled
                            >
                                Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            
            `
            
            dataUserAccept.appendChild(div)
    
    
            //cancel accept friend
            const buttonRefuse = div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse)
            //accept friend
            const buttonAccept = div.querySelector("[btn-accept-friend]")
            acceptFriends(buttonAccept)
            
        }
    }
    //user page
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]")
    if(dataUserNotFriend){
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend")
        if(userId == data.userId){
            const boxUserRemove = dataUserNotFriend.querySelector(`[user-id='${data.infoUserA._id}']`)
            if(boxUserRemove){
                dataUserNotFriend.removeChild(boxUserRemove)
                
            }
        }
    }
    
})



//end SERVER_RETURN_INFO_ACCEPT_FRIEND

//SERVER_RETURN_USER_ID_CANCEL_FRIEND

socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`)
    if(boxUserRemove){
        const dataUserAccept = document.querySelector("[data-users-accept]")
        const badgeUsersAccept = document.querySelector("[badge-users-accept]")
        const userIdB = badgeUsersAccept.getAttribute("badge-users-accept")
        if(userIdB === data.userIdB){
            dataUserAccept.removeChild(boxUserRemove)
        }
        
    }
})

//end SERVER_RETURN_USER_ID_CANCEL_FRIEND

//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
    const dataUserFriend = document.querySelector("[data-users-friend]")
    if(dataUserFriend){
        const boxUser = dataUserFriend.querySelector(`[user-id='${data.userId}']`)
        if(boxUser) {
            const boxStatus = boxUser.querySelector("[status]")
            boxStatus.setAttribute("status", data.status)
        }
            
    }
})

//end SERVER_RETURN_USER_ONLINE