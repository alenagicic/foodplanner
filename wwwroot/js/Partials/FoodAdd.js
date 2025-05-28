import './popup.js';
import { createPopup, populateErrorMessage, populateImageUpload, populateSuccessMessage, removePopup } from './popup.js';

// Inputdata Ingredients

const inputIngredientOne = document.getElementById("a1")
const inputIngredientTwo = document.getElementById("a2")
const inputIngredientThree = document.getElementById("a3")
const buttonAddFood = document.getElementById("ingredient-submit-btn")

// Inputdata Information

const inputHeader = document.getElementById("food-header")
const inputInstructions = document.getElementById("food-textarea")
const inputSelectBudget = document.getElementById("food-select-budget")
const inputSelectDiet = document.getElementById("food-select-diet")

// Error message
const errorMessage = document.getElementById("error-ingredient")

// Tabs
const ingredientTab = document.querySelector(".food-tab-one")
const instructionsTab = document.querySelector(".food-tab-two")
const foodTab = document.querySelector(".food-tab-three")

// Main containers
const ingredientContainer = document.querySelector(".food-ingredients")
const instructionContainer = document.querySelector(".food-instructions")
const foodContainer = document.querySelector(".food-images")

// Image upload
const imageUploadButton = document.getElementById("food-image-upload-btn")
const imageUploadContainer = document.querySelector(".food-images-uploaded")

// Submit entire form button

const submitButton = document.querySelector(".update-food-btn")


window.onload = () => {
    ingredientTab.style.backgroundColor = "#dcdcdc"
    ingredientTab.style.color = "#2c3e50"

    ingredientContainer.style.display = "flex"
    instructionContainer.style.display = "none"
    foodContainer.style.display = "none"

    foodTab.style.backgroundColor = "transparent"
    foodTab.style.color = "whitesmoke"
    instructionsTab.style.backgroundColor = "transparent"
    instructionsTab.style.color = "whitesmoke"

    inputIngredientThree.placeholder = "Enter adds to list!"

    setTimeout(() => {
        inputIngredientOne.focus()
    }, 100);


    let apiUrl = document.getElementById("api-url").innerText

    // Below intitial request

    if(submitButton.innerText.trim() == "Add"){
    
        submitButton.addEventListener("mousedown", (e) => {
              
        const data = CollectAllDataAndReturnDict()

        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer some-token',
            },
            body: JSON.stringify(data)
        };

                  
        fetch(apiUrl, options)
            .then(response => {
                if (!response.ok) {

                    createPopup()
                    populateErrorMessage()
                    setTimeout(() => {
                        removePopup()
                    }, 2600);

                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
            .then(data => {
                createPopup()
                populateSuccessMessage()
                setTimeout(() => {
                    removePopup()
                    setTimeout(() => {
                        window.location.reload()
                    }, 100);
                }, 2600);

            })
            .catch(error => {
                console.error('Error:', error);
            });


        })

    }else if(submitButton.innerText.trim() == "Update"){
        
        inputHeader.style.pointerEvents = "none"
        inputHeader.style.opacity = "0.8"

        // If update
        
        let apiUrl = document.getElementById("api-url").innerText

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer some-token',
            },
        };
        
        fetch(apiUrl, options)
            .then(response => {
                if (!response.ok) {
        
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                PopulateFields(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });


            submitButton.addEventListener("mousedown", (e) => {
                const data = CollectAllDataAndReturnDict()

                const options = {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer some-token',
                    },
                    body: JSON.stringify(data)
                };
        
                          
                fetch(apiUrl, options)
                .then(response => {
                    if (!response.ok) {
    
                        createPopup()
                        populateErrorMessage()
                        setTimeout(() => {
                            removePopup()
                        }, 2600);
    
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response;
                })
                .then(data => {
                    createPopup()
                    populateSuccessMessage()
                    setTimeout(() => {
                        removePopup()
                        setTimeout(() => {
                            window.location.reload()
                        }, 100);
                    }, 2600);
    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        
            })
    }

}

// Button for adding ingredients
buttonAddFood.addEventListener("mousedown", (e) => {


    if (inputIngredientOne.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);        
        return
    }

    if(inputIngredientThree.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);        return
    }

    if (inputIngredientOne.value !== ""){
        errorMessage.style.display = "none"
        
    }
    if (inputIngredientTwo.value !== ""){
        errorMessage.style.display = "none"
    }
         

    // Addvalues to div above it
    var newDiv = document.createElement("div");
    var newPara1 = document.createElement("p");
    var newPara2 = document.createElement("p");
    var newPara3 = document.createElement("p");
    var newDelete = document.createElement("span")

    newPara1.innerText = inputIngredientOne.value
    newPara2.innerText = inputIngredientTwo.value
    newPara3.innerText = inputIngredientThree.value
    newDelete.innerHTML = 'Delete'

    newDiv.classList.add("food-added-ingredient")
    newPara1.classList.add("food-added-para1")
    newPara2.classList.add("food-added-para2")
    newPara3.classList.add("food-added-para3")
    newDelete.classList.add("food-added-para4")

    newDiv.appendChild(newPara1)
    newDiv.appendChild(newPara2)
    newDiv.appendChild(newPara3)
    newDiv.appendChild(newDelete)

    let divToAppend = document.querySelector(".food-input-wrapper")

    let firstChild = divToAppend.children[1]

    divToAppend.insertBefore(newDiv, firstChild)

    setTimeout(() => {
        inputIngredientOne.value = ""
        inputIngredientTwo.value = ""
        inputIngredientThree.value = ""
        inputIngredientOne.focus()
    }, 100);

})
// Listen to keypress on inputs
inputIngredientOne.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        

    if (inputIngredientOne.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);
        
        return
    }

    if(inputIngredientThree.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);
        return
    }

    if (inputIngredientOne.value !== ""){
        errorMessage.style.display = "none"
        
    }
    if (inputIngredientTwo.value !== ""){
        errorMessage.style.display = "none"
    }
         

    // Addvalues to div above it
    var newDiv = document.createElement("div");
    var newPara1 = document.createElement("p");
    var newPara2 = document.createElement("p");
    var newPara3 = document.createElement("p");
    var newDelete = document.createElement("span")

    newPara1.innerText = inputIngredientOne.value
    newPara2.innerText = inputIngredientTwo.value
    newPara3.innerText = inputIngredientThree.value
    newDelete.innerHTML = 'Delete'

    newDiv.classList.add("food-added-ingredient")
    newPara1.classList.add("food-added-para1")
    newPara2.classList.add("food-added-para2")
    newPara3.classList.add("food-added-para3")
    newDelete.classList.add("food-added-para4")

    newDiv.appendChild(newPara1)
    newDiv.appendChild(newPara2)
    newDiv.appendChild(newPara3)
    newDiv.appendChild(newDelete)

    let divToAppend = document.querySelector(".food-input-wrapper")

    let firstChild = divToAppend.children[1]

    divToAppend.insertBefore(newDiv, firstChild)

    setTimeout(() => {
        inputIngredientOne.value = ""
        inputIngredientThree.value = ""
        inputIngredientOne.focus()
    }, 100);

    }
})
inputIngredientThree.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        

    if (inputIngredientOne.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);        return
    }

    if(inputIngredientThree.value.trim() === ""){
        setTimeout(() => {
            buttonAddFood.style.transitionDuration = "0.2s"
            buttonAddFood.style.backgroundColor = "#FF0000 "
            errorMessage.style.display = "block"
            setTimeout(() => {
            buttonAddFood.style.backgroundColor = "#2c3e50"
            }, 1000);
        }, 100);        return
    }

    if (inputIngredientOne.value !== ""){
        errorMessage.style.display = "none"
        
    }
    if (inputIngredientTwo.value !== ""){
        errorMessage.style.display = "none"
    }
         

    // Addvalues to div above it
    var newDiv = document.createElement("div");
    var newPara1 = document.createElement("p");
    var newPara2 = document.createElement("p");
    var newPara3 = document.createElement("p");
    var newDelete = document.createElement("span")

    newPara1.innerText = inputIngredientOne.value
    newPara2.innerText = inputIngredientTwo.value
    newPara3.innerText = inputIngredientThree.value
    newDelete.innerHTML = 'Delete'

    newDiv.classList.add("food-added-ingredient")
    newPara1.classList.add("food-added-para1")
    newPara2.classList.add("food-added-para2")
    newPara3.classList.add("food-added-para3")
    newDelete.classList.add("food-added-para4")

    newDiv.appendChild(newPara1)
    newDiv.appendChild(newPara2)
    newDiv.appendChild(newPara3)
    newDiv.appendChild(newDelete)

    let divToAppend = document.querySelector(".food-input-wrapper")

    let firstChild = divToAppend.children[1]

    divToAppend.insertBefore(newDiv, firstChild)

    setTimeout(() => {
        inputIngredientOne.value = ""
        inputIngredientThree.value = ""
        inputIngredientOne.focus()
    }, 100);

    }
})
//Button for removing ingredient
document.addEventListener("mousedown", (e) => {
    if (e.target && e.target.classList.contains("food-added-para4")) {
        let parent = e.target.parentElement;
        parent.remove();
    }
});
// ingredientPress
ingredientTab.addEventListener("mousedown", (e) => {
    ingredientContainer.style.display = "flex"
    instructionContainer.style.display = "none"
    foodContainer.style.display = "none"

    ingredientTab.style.backgroundColor = "#dcdcdc"
    ingredientTab.style.color = "#2c3e50"

    foodTab.style.backgroundColor = "transparent"
    foodTab.style.color = "whitesmoke"
    instructionsTab.style.backgroundColor = "transparent"
    instructionsTab.style.color = "whitesmoke"
    
    setTimeout(() => {
            inputIngredientOne.focus()
    }, 200);

})
// instructionPress
instructionsTab.addEventListener("mousedown", (e) => {
    instructionContainer.style.display = "flex"
    foodContainer.style.display = "none"
    ingredientContainer.style.display = "none"   
    
    instructionsTab.style.backgroundColor = "#dcdcdc"
    instructionsTab.style.color = "#2c3e50"

    foodTab.style.backgroundColor = "transparent"
    foodTab.style.color = "whitesmoke"
    ingredientTab.style.backgroundColor = "transparent"
    ingredientTab.style.color = "whitesmoke"

    setTimeout(() => {
        if (inputHeader.style.pointerEvents != "none") {
           inputHeader.focus()
        }
     
    }, 200);

})
// foodPress
foodTab.addEventListener("mousedown", (e) => {
    ingredientContainer.style.display = "none"
    instructionContainer.style.display = "none"
    foodContainer.style.display = "flex"
    
    foodTab.style.backgroundColor = "#dcdcdc"
    foodTab.style.color = "#2c3e50"

    ingredientTab.style.backgroundColor = "transparent"
    ingredientTab.style.color = "whitesmoke"
    instructionsTab.style.backgroundColor = "transparent"
    instructionsTab.style.color = "whitesmoke"

    setTimeout(() => {
        imageUploadButton.classList.add("vibrating")
    }, 200);

})
// imageUpload
imageUploadButton.addEventListener("mousedown", (e) => {
    
    createPopup()

    populateImageUpload()
  
})



// Collect the fields data
function CollectAllDataAndReturnDict(){
    let IngredientOne = document.querySelectorAll(".food-added-para1")
    let IngredientTwo = document.querySelectorAll(".food-added-para2")
    let IngredientThree = document.querySelectorAll(".food-added-para3")


    let IngredientList = []

    for(var i = 0; i < IngredientOne.length; i++){
        
        const newList = [IngredientOne[i].innerText.trim(), IngredientTwo[i].innerText.trim(), IngredientThree[i].innerText.trim()]

        IngredientList.push(newList)
    }

    let ImageContainer = document.querySelectorAll(".food-image-container");

    let ListofImages = [];

    ImageContainer.forEach(container => {
        let image = container.querySelector("img");    
        console.log(image.src)
        if (image.hasAttribute('src')) {
            ListofImages.push(image.src);
        } else {
            console.warn("Image has no src attribute.");
        }
    
    });
    
    const recipe = {
            Header: inputHeader.value.trim(),
            IngredientList: IngredientList,
            PriceRange: inputSelectBudget.value.trim(),
            FoodType: inputSelectDiet.value.trim(),
            Instructions: inputInstructions.value.trim(),
            ListOfImages: ListofImages,
            IsUpdate: false,
            ApiUrl: null,
            Rating: "4/5"
    };

      return recipe

}
// Populates the fields food edit
function PopulateFields(array) {

    // Populates ingredients
    array.ingredientList.forEach((item, index) => {
        var newDiv = document.createElement("div");
        var newPara1 = document.createElement("p");
        var newPara2 = document.createElement("p");
        var newPara3 = document.createElement("p");
        var newDelete = document.createElement("span")
    
        newPara1.innerText = item[0]
        newPara2.innerText = item[1]
        newPara3.innerText = item[2]
        newDelete.innerHTML = 'Delete'
    
        newDiv.classList.add("food-added-ingredient")
        newPara1.classList.add("food-added-para1")
        newPara2.classList.add("food-added-para2")
        newPara3.classList.add("food-added-para3")
        newDelete.classList.add("food-added-para4")
    
        newDiv.appendChild(newPara1)
        newDiv.appendChild(newPara2)
        newDiv.appendChild(newPara3)
        newDiv.appendChild(newDelete)
    
        let divToAppend = document.querySelector(".food-input-wrapper")
    
        let firstChild = divToAppend.children[2]
    
        divToAppend.insertBefore(newDiv, firstChild)
    });


    // Populates instructions
    inputHeader.value = array.header

    inputInstructions.value = array.instructions

    inputSelectBudget.value = array.priceRange

    inputSelectDiet.value = array.foodType

    // Populates images

    for(var i = 0; i < array.listOfImages.length; i++){

        const newInput = document.createElement('img');
        const wrapperDiv = document.createElement('div')
        const newDelete = document.createElement('div')

        wrapperDiv.classList.add("food-image-container")
        newDelete.classList.add("delete-icon")

        newInput.src = array.listOfImages[i];
        newDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';

        wrapperDiv.appendChild(newInput)
        wrapperDiv.appendChild(newDelete)
            
        imageUploadContainer.appendChild(wrapperDiv)

    }

}

