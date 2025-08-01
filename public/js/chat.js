import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'



//file upload with preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
})


//end file upload with preview


//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray
        if(content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images:images
            })
            
            e.target.elements.content.value= ""
            upload.resetPreviewPanel()
            socket.emit("CLIENT_SENT_TYPING", "hidden")
        }
    })
}
//CLIENT_SEND_MESSAGE

//SERVER_RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const div = document.createElement("div");
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    let htmlFullName = ""
    let htmlContent = ""
    let htmlImages= ""
    
    if(myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }

    if (data.content) {
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `
    }
    if(data.images.length > 0) {
        htmlImages += `<div class="inner-images">`
        
        for(const image of data.images) {
            htmlImages += `<img src="${image}">`
        }

        htmlImages +=`</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
        
    `

    body.insertBefore(div, boxTyping)
    body.scrollTop = body.scrollHeight

    //preview Images
    const gallery = new Viewer(div)

})
//END SERVER_RETURN MESSAGE

//Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
//end scroll chat


//show Icon chat
//show popup
const buttonIcon = document.querySelector('.button-icon')
if(buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//end show popup
//showTyping
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SENT_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SENT_TYPING", "hidden")
    }, 3000)
}


//endshowTyping
const emojiPicker = document.querySelector("emoji-picker")
if(emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode
        inputChat.value = inputChat.value + icon

        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end)
        inputChat.focus()
        showTyping()
    })
    //input keyup


    inputChat.addEventListener("keyup", () =>{
        showTyping()
    })
    //end input keyup
}



//end show Icon chat

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")

if(elementListTyping){
    socket.on("SERVER_RETURN_TYPING", (data) => {
        console.log(data)
        if(data.type == "show") {
            const bodyChat = document.querySelector(".chat .inner-body")
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if(!existTyping) {
                const boxTyping = document.createElement("div")

                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userId)

                boxTyping.innerHTML = `
                    <div class="box-typing">
                        <div class="inner-name">${data.fullName} </div>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `

                elementListTyping.appendChild(boxTyping)

                if(bodyChat) {
                    bodyChat.scrollTop = bodyChat.scrollHeight
                }
            } 

            
        }
        else if(data.type == "hidden") {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            console.log(boxTypingRemove)

            if(boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove)
            }

        }
    })
}

//end SERVER_RETURN_TYPING

//preview full image
const bodyChatPreviewImages = document.querySelector(".chat .inner-body")
if(bodyChatPreviewImages) {
    const gallery = new Viewer(bodyChatPreviewImages);
}
//end preview full image



