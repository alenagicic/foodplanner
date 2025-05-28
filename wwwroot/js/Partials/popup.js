// Consider breaking out these functions into individual components!

export function createPopup() {
    const createOverlay = document.createElement('div')
    const createInnerdiv = document.createElement('div')
    const xMark = document.createElement("p")
    const divXmark = document.createElement("div")

    createOverlay.classList.add('popup-overlay')
    createInnerdiv.classList.add('popup-innerdiv')
    xMark.classList.add("x-mark")
    divXmark.classList.add("x-mark-div")

    xMark.innerHTML = "✖"
    divXmark.appendChild(xMark)
    
    createOverlay.appendChild(createInnerdiv)
    createOverlay.appendChild(divXmark)

    document.body.appendChild(createOverlay)

    setTimeout(() => {
        let overlaySelected = document.querySelector(".popup-overlay");
        overlaySelected.style.opacity = "1"

        overlaySelected.addEventListener("mousedown", (e) => {
            // Check if the click is on the overlay itself, not its children
            if (e.target === overlaySelected) {
                overlaySelected.remove(); // Remove the overlay if clicked directly
            }
        });
    }, 500);

    xMark.addEventListener("mousedown", (e) => {
        removePopup()
    })

    //Needs a if target is not then remove
}

export function removePopup(){
    let removeOverlay = document.querySelector(".popup-overlay")
    removeOverlay.remove()
}

// Image upload

export function populateImageUpload(){

    let image_upload = document.createElement("div")
    let upload_box = document.createElement("div")
    let input = document.createElement("input")
    let inputReplace = document.createElement("div")
    let placeholder = document.createElement("i")

    input.type = "file"
    input.style.display = "none"
    inputReplace.innerText = "Upload Image"
    placeholder.innerHTML = '<i class="fa-solid fa-images"></i>'

    image_upload.classList.add("image-upload")
    upload_box.classList.add("upload-box")
    inputReplace.classList.add("upload-input")
    input.classList.add("upload-input-actual")

    upload_box.appendChild(placeholder)
    image_upload.append(upload_box)
    inputReplace.appendChild(input)
    image_upload.append(inputReplace)
    


    document.querySelector(".popup-innerdiv").appendChild(image_upload)
 
    setTimeout(() => {
        document.querySelector(".image-upload").style.opacity = "1"

        let inputHidden = document.querySelector(".upload-input-actual");
        let inputWrapper = document.querySelector(".upload-input");
        
        inputWrapper.addEventListener("mousedown", () => {
            inputHidden.click();
           
            setTimeout(() => {
                inputWrapper.remove()

                let newWrapper = document.createElement("div")
                newWrapper.classList.add("upload-input")
                newWrapper.innerText = "Submit"

                document.querySelector(".image-upload").appendChild(newWrapper)
            }, 1000);


        });

    
        inputHidden.addEventListener('change', () => {
            if (inputHidden.files.length > 0) {
                inputWrapper.innerText = "Submit";
                
                let file = inputHidden.files[0];
                let reader = new FileReader();

                // When the file is loaded, display the image
                reader.onload = function(e) {
                    let img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.width = "100%";
                    img.style.height = "auto"

                    // Clear the box and append the image
                    upload_box.innerHTML = "";
                    upload_box.appendChild(img);
                };

                // Read the file as a data URL
                reader.readAsDataURL(file);


                let buttonSubmit = document.querySelector(".upload-input")

                buttonSubmit.addEventListener("mousedown", (e) => {

                        // When the file is loaded, display the image
                        reader.onload = function(e) {
                            let divCreated = document.createElement("div")
                            divCreated.classList.add("food-image-container")

                            let img = document.createElement("img");
                            img.src = e.target.result;
                            img.style.height = "100%";

                            let div = document.createElement("div")
                            div.classList.add("delete-icon")

                            let faTrash = document.createElement("i")
                            faTrash.innerHTML = `<i class="fa-solid fa-trash"></i>`
            
                            div.appendChild(faTrash)

                            const mainDiv = document.querySelector(".food-images-uploaded")
            
                            divCreated.appendChild(img)
                            divCreated.appendChild(div)
                            mainDiv.appendChild(divCreated)

                            removePopup()


                            // Add event listener that removes the image on trashpress
                            faTrash.addEventListener("mousedown", (e) => {
                                faTrash.parentElement.parentElement.remove()
                            })
                         
                        };
            
                        // Read the file as a data URL
                        reader.readAsDataURL(file);
                })
            }
        });

    }, 500);

}

// Image upload ends

// Function for generator starts

export function populateFoodGenerator(){
    //Wrappers

    let generatorWrapper = document.createElement("div")
    generatorWrapper.classList.add('food-populate-popup')

    let generatePrice = document.createElement("div")
    generatePrice.classList.add('generate-pricerange')

    let generateAmmount = document.createElement("div")
    generateAmmount.classList.add('generate-ammount')

    let generateType = document.createElement("div")
    generateType.classList.add('generate-type')

    let generateSubmit = document.createElement('div')
    generateSubmit.classList.add('generate-food-submit')

    // Populate Pricerange
    for(var i = 0; i < 3; i++){
        let oneDiv = document.createElement('div')
        oneDiv.classList.add('pricerange-items')
        generatePrice.appendChild(oneDiv)
    }

    generatePrice.children[0].innerText = "Cheap";
    // Preselect item
    generatePrice.children[1].style.backgroundColor = "#34495e"
    generatePrice.children[1].style.color = "whitesmoke"

    generatePrice.children[1].innerText = "Budget";
    generatePrice.children[2].innerText = "Pricey";

    // Populate Ammount
    for(var i = 0; i < 3; i++){
        let twoDiv = document.createElement('div')
        twoDiv.classList.add('ammount-items')
        generateAmmount.appendChild(twoDiv)
    }

    generateAmmount.children[0].innerText = "3";

    // Preselect item
    generateAmmount.children[0].style.backgroundColor = "#34495e"
    generateAmmount.children[0].style.color = "whitesmoke"

    generateAmmount.children[1].innerText = "5";
    generateAmmount.children[2].innerText = "7";

    // Populate Type
    for(var i = 0; i < 2; i++){
        let threeDiv = document.createElement('div')
        threeDiv.classList.add('type-items')
        generateType.appendChild(threeDiv)
    }
    generateType.children[0].innerText = "Vegan";

    // Preselect item
    generateType.children[1].style.backgroundColor = "#34495e"
    generateType.children[1].style.color = "whitesmoke"
    
    generateType.children[1].innerText = "Regular";


    // Populate submit

    generateSubmit.innerText = "Generate recipes!"

    // Labels for the different buttons

    let paraOne = document.createElement("p")
    let paraTwo = document.createElement("p")
    let paraThree = document.createElement("p")

    paraOne.innerText = "Pricerange"
    paraTwo.innerText = "Meals"
    paraThree.innerText = "Dietary Preference"


    // Prefill the selection



    // Append all to wrapper
    generatorWrapper.appendChild(paraOne)
    generatorWrapper.appendChild(generatePrice)
    generatorWrapper.appendChild(paraTwo)
    generatorWrapper.appendChild(generateAmmount)
    generatorWrapper.appendChild(paraThree)
    generatorWrapper.appendChild(generateType)
    generatorWrapper.appendChild(generateSubmit)

    document.querySelector(".popup-innerdiv").appendChild(generatorWrapper)

    // From here and below, event listener

    let rowOne = document.querySelectorAll(".pricerange-items")
    let rowTwo = document.querySelectorAll(".ammount-items")
    let rowThree = document.querySelectorAll(".type-items")

    rowOne.forEach((item, index) => {
        item.addEventListener("mousedown", (e) => {

            // Enlargens the item when clicking
            setTimeout(() => {
                item.style.transform = "scale(1.1)"
                item.style.transitionDuration = "0.2s"
                setTimeout(() => {
                    item.style.transform = "scale(1)"
                }, 200);
            }, 50);

            // if its clicked unclick and return
            if(item.style.backgroundColor == "rgb(52, 73, 94)"){
                item.style.backgroundColor = "transparent"
                item.style.color = "#34495e"
                return
            }
            
            // Important that this is placed here, clears all before making new selection
            for(var i = 0; i < rowOne.length; i++){
            rowOne[i].style.backgroundColor = "transparent"
            rowOne[i].style.color = "#34495e"
            }

            item.style.backgroundColor = "#34495e"
            item.style.color = "whitesmoke"
        })
    });

    rowTwo.forEach((item, index) => {
        item.addEventListener("mousedown", (e) => {

            // Enlargens the item when clicking
            setTimeout(() => {
                item.style.transform = "scale(1.1)"
                item.style.transitionDuration = "0.2s"

                setTimeout(() => {
                    item.style.transform = "scale(1)"
                }, 200);
            }, 50);

            if(item.style.backgroundColor == "rgb(52, 73, 94)"){
                item.style.backgroundColor = "transparent"
                item.style.color = "#34495e"
                return
            }

            // Important that this is placed here, clears all before making new selection
            for(var i = 0; i < rowTwo.length; i++){
            rowTwo[i].style.backgroundColor = "transparent"
            rowTwo[i].style.color = "#34495e"
            }


            item.style.backgroundColor = "#34495e"
            item.style.color = "whitesmoke"

        })
    });

    rowThree.forEach((item, index) => {
        item.addEventListener("mousedown", (e) => {

            // Enlargens the item when clicking
            setTimeout(() => {
                item.style.transform = "scale(1.1)"
                item.style.transitionDuration = "0.2s"

                setTimeout(() => {
                    item.style.transform = "scale(1)"
                }, 200);
            }, 50);

            if(item.style.backgroundColor == "rgb(52, 73, 94)"){
                item.style.backgroundColor = "transparent"
                item.style.color = "#34495e"
                return
            }

            // Important that this is placed here, clears all before making new selection
            for(var i = 0; i < rowThree.length; i++){
                rowThree[i].style.backgroundColor = "transparent"
                rowThree[i].style.color = "#34495e"
            }

            item.style.backgroundColor = "#34495e"
            item.style.color = "whitesmoke"
        })
    });

    let submitButton = document.querySelector(".generate-food-submit")
    submitButton.addEventListener("mousedown", (e) => {

        // From here and below, make the request!

        let fetchUrl = document.getElementById("generator-link")

        let budgetValue 
        let amountValue 
        let typeValue 

        rowOne.forEach((item) => {
            const backgroundColor = window.getComputedStyle(item).backgroundColor;
    
            if (backgroundColor === "rgb(52, 73, 94)") {
                budgetValue = item.innerText;
            }
        })

        rowTwo.forEach((item) => {
            const backgroundColor = window.getComputedStyle(item).backgroundColor;
    
            if (backgroundColor === "rgb(52, 73, 94)") {
                amountValue = item.innerText;
            }
        })

        rowThree.forEach((item) => {
            const backgroundColor = window.getComputedStyle(item).backgroundColor;
    
            if (backgroundColor === "rgb(52, 73, 94)") {
                typeValue = item.innerText;
            }
        })


        fetch(`${fetchUrl.innerText}`+`${budgetValue}/${amountValue}/${typeValue}`, {
            method: 'GET',  
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify()
            })
            .then(response => response.json())
            .then(data => populateGeneratorWithOptions(data, fetchUrl.innerText))
            .catch(error => console.error('Error:', error));

    })
}

function populateGeneratorWithOptions(data, url){
    
    removePopup()
    createPopup()

    let mainDiv = document.querySelector(".popup-innerdiv")

    let presentDiv = document.createElement("div")
    presentDiv.classList.add("popup-generate-confirmation")
    
    for(var i = 0; i < data.length; i++){
        let para = document.createElement("p")
        para.innerText = `${data[i].header}`
        presentDiv.appendChild(para)
    }


    let buttonDiv = document.createElement("div")
    buttonDiv.innerText = "Download"
    buttonDiv.classList.add("popup-generate-confirmation-btn")

    let header = document.createElement("h5")
    header.innerText = "Generated recipes"

    presentDiv.prepend(header)

    presentDiv.appendChild(buttonDiv)

    mainDiv.appendChild(presentDiv)

    // Landade här, osäker på hur jag ska populera shoppinglistan?
    // Alternativt redan i detta skede skapa en pdf?

    buttonDiv.addEventListener("mousedown", (e) => {
        
        let htmlContent = '';

        data.forEach(item => {

            htmlContent += `
                <div style="display:flex; flex-direction:column; align-items:center; height:297mm; font-family: Arial, sans-serif; padding: 10mm; box-sizing: border-box; overflow:hidden">
                    <h1 style:color:teal;>${item.header.toUpperCase()}</h1>
                    <p><strong>Diet:</strong> ${item.foodType.toUpperCase()}</p>
                    <p><strong>Pricerange:</strong> ${item.priceRange.toUpperCase()}</p>
                    
                    <p><strong>Ingredients:</strong></p>
                    <div style="width:60%; display:flex; flex-wrap:wrap;">
                        ${item.ingredientList.map(ingredient => `<div style="color:teal; width:100%;">&rarr;&nbsp;&nbsp;<span>${ingredient.flat().join(" ")}</span></div>`)}
                    </div>

                    <strong>Instructions:</strong>
                    <div style="width:60%; display:flex; flex-wrap:wrap; color:teal;"> ${item.instructions}</div>

                    ${item.listOfImages.length > 0 ? `
                        <p><strong>Images:</strong></p>
                        <div style="width:100%; display:flex; flex-wrap:wrap; column-gap:1rem; justify-content:center">
                        ${item.listOfImages.map(image => `<img src="${image}" alt="Recipe Image" style="width: 200px; height: 200px; margin-right: 10px;">`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

        });

        // Create a temporary container to hold the HTML content
        let contentDiv = document.createElement('div');
        contentDiv.innerHTML = htmlContent;

        html2pdf(contentDiv, {
            margin: 0,
            padding: 0,
            filename: 'document.pdf',
            jsPDF: {
                unit: 'mm',
                format: 'a4', 
                orientation: 'portrait', 
                pagesplit: true, 

            }
        });
    })

}

// This code exists in two modules needs to be refactored!

// Functions for generator ends

export function populateSuccessMessage(){
    
    let wrapperDiv = document.createElement("div")
    let successMessage = document.createElement("span")
    let checkSuccess = document.createElement("i")

    wrapperDiv.innerHTML = `<i class="fa-solid fa-check"></i>`

    wrapperDiv.classList.add("success-populate-popup")

    document.querySelector(".popup-innerdiv").appendChild(wrapperDiv)
}

export function populateErrorMessage(){
    let wrapperDiv = document.createElement("div")
    let successMessage = document.createElement("span")
    let checkSuccess = document.createElement("i")

    wrapperDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`

    wrapperDiv.classList.add("error-populate-popup")

    document.querySelector(".popup-innerdiv").appendChild(wrapperDiv)
}

export function populateCartNoGenerate(){

    let wrapperDiv = document.createElement("div")
    let inputName = document.createElement("input")
    let submitButton = document.createElement("button")

    inputName.type = "text"
    inputName.placeholder = "List name*"
    submitButton.innerText = "Submit"

    wrapperDiv.classList.add("cart-populate-noGen")

    wrapperDiv.appendChild(inputName)
    wrapperDiv.appendChild(submitButton)

    document.querySelector(".popup-innerdiv").appendChild(wrapperDiv)

}

