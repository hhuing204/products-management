//button status
const buttonsStatus = document.querySelectorAll("[button-status]")
// console.log(buttonsStatus)
if(buttonsStatus.length > 0) {
    let url = new URL(window.location.href)

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const status = button.getAttribute("button-status")
            if(status) {
                url.searchParams.set("status", status);
                url.searchParams.set("page", 1)
            } else {
                url.searchParams.delete("status")
                url.searchParams.set("page", 1)
            }
            
            window.location.href = url.href

        })
    })
}
//end button status

//form Search
const formSearch = document.querySelector("#form-search")
if(formSearch) {
    let url = new URL(window.location.href)

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value
        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword")
        }
        
        window.location.href = url.href
    })
}
//form Search

//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")

            url.searchParams.set("page", page)
            
            window.location.href = url.href
        })
    })

}
//pagination


//checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = document.querySelectorAll("input[name='id']:checked").length
            if(countChecked === inputsId.length){
                inputCheckAll.checked = true
            } else {
                inputCheckAll.checked = false
            }
        })
    })
}
//checkbox

//change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
// console.log(formChangeMulti)
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
        
        const typeChange = e.target.elements.type.value;
        if (typeChange == "delete-all"){
            const isConfirm = confirm("Are you sure you want to delete these products?")
            if(!isConfirm) {
                return
            }
        }



        if(inputChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            // console.log(inputIds)

            inputChecked.forEach(input => {
                const id = input.value

                if(typeChange == "change-position"){
                    const position = input
                        .closest("tr") //tim phan tu cha
                        .querySelector("input[name='position']").value 
                    ids.push(`${id}-${position}`)

                
                } else {
                    ids.push(id)
                }

                
            })

            inputIds.value = ids.join(", ")
            // console.log(ids.join(", "))
            formChangeMulti.submit()
            // console.log(inputIds)

        } else {
            alert("Please choosing at least one product !")
        }
    })
}
//form change multi


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

//only choose one of link and upload
const linkInput = document.getElementById('thumbnailLink');
const fileInput = document.getElementById('thumbnailFile');
function handleLinkInput() {
    if (linkInput.value.trim() !== '') {
      fileInput.disabled = true;
    } else {
      fileInput.disabled = false;
    }
  }

function handleFileInput() {
    if (fileInput.files.length > 0) {
      linkInput.disabled = true;
    } else {
      linkInput.disabled = false;
    }
  }


  //upload image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImageInputPreview = document.querySelector("[upload-image-preview]")
    const buttonDelete = document.querySelector("[button-delete]")

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if(file) {
            uploadImageInputPreview.src = URL.createObjectURL(file)
            if(buttonDelete) {
                buttonDelete.style.display = "inline-block"
            }
        }

        buttonDelete.addEventListener("click", () =>{
            uploadImageInputPreview.src=""
            uploadImageInput.value=""
            buttonDelete.style.display = "none"
            linkInput.disabled = false
        })
    })

    
}
  //end upload image

  //sort
const sort = document.querySelector("[sort]")
if(sort) {
    let url = new URL(window.location.href)

    const sortSelect = sort.querySelector("[sort-select]")
    const sortClear = sort.querySelector("[sort-clear]")

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value
        const [sortKey, sortValue] = value.split("-")

        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue", sortValue)

        window.location.href = url.href
    })

    //delete sort
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")

        window.location.href = url.href
    })

    //add selected for option
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")

    if(sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)

        optionSelected.selected = true
    }

    // end add selected for option
}
  //end sort