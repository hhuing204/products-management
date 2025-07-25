//permissions


const tablePermissions = document.querySelector("[table-permissions]")
if(tablePermissions){
    const buttonSubmit = document.querySelector("[button-submit]")

    buttonSubmit.addEventListener("click", () =>{
        let permissions = []

        const rows = tablePermissions.querySelectorAll("[data-name]")
        rows.forEach(row => {
            const name = row.getAttribute("data-name")
            const inputs = row.querySelectorAll("input")
            // console.log(inputs)
            if(name == "id") {
                inputs.forEach(input => {
                    const id = input.value
                    permissions.push({
                        id: id,
                        listPermissions: []
                    })
                })
            } else {
                inputs.forEach((input, index )=> {
                    const checked = input.checked

                    if (checked) {
                        permissions[index].listPermissions.push(name)
                    }
                })
            }
        })
        
        if(permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions")
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']")
            inputPermissions.value = JSON.stringify(permissions)
            formChangePermissions.submit()
        }
    })  
}

//end permissions

//permissions data default

const dataRecords = document.querySelector("[data-records]")
if(dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"))
    const tablePermissions = document.querySelector("[table-permissions]")

    records.forEach((record, index) => {
        const permissions = record.permissions
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`)

            const input = row.querySelectorAll("input")[index]

            input.checked = true
        })
    })
}

//end permissions data default