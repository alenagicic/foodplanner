const scrollCategory = document.querySelector(".discover-scroll-ctgry")
const scrollCategoryHead = document.querySelector(".discover-heading-selection")
const scrollItems = document.querySelector(".discover-scroll-cntnt")
const scrollItemsHead = document.querySelector(".discover-heading-cntnt")
const scrollItemsHeadInn = document.querySelector(".discover-heading-cntnt-filter")
const submitRecipe = document.querySelector(".fa-pen-to-square")
const reloadWindow = document.querySelector(".fa-rotate")

function loadPopupDiscover(id) {
    fetch(window.location.origin + `/discover/getrecipe/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            createPopupDiscover(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function createPopupDiscover(data) {
    
    const popup = document.createElement('div');
    popup.classList.add('pp-disc-pop');
    
    // Create and add the heading
    const heading = document.createElement('div');
    const headingImage = document.createElement('img')
    const headingPara = document.createElement('h3')
    headingPara.innerText = `${data.heading}`
    const headingCreator = document.createElement('p')
    headingCreator.innerText = `Contributor: ${data.author}`
    headingImage.src = data.imageRecipe
    headingImage.classList.add('header-image-recipe')
    heading.classList.add('pp-disc-pop-head');
    heading.appendChild(headingPara)
    heading.appendChild(headingCreator)
    heading.appendChild(headingImage)
    popup.appendChild(heading);
    
    // Create the body content container
    const bodyWrap = document.createElement('div');
    bodyWrap.classList.add('pp-disc-pop-wrap-bdy');
    
    // Instructions section
    const instructions = document.createElement('p');
    instructions.classList.add('pp-disc-pop-bdy');
    instructions.innerHTML = `<label>Instructions:</label> ${data.bodyRecipe}`; 
    bodyWrap.appendChild(instructions);
    
    // Ingredient section
    const Ingredient = document.createElement('p');
    Ingredient.classList.add('pp-disc-pop-ingr');
    Ingredient.innerHTML = `<label>Ingredients:</label> ${data.ingredientRecipe}`; 
    bodyWrap.appendChild(Ingredient);

    // Rating section
    const rating = document.createElement('p');
    rating.classList.add('pp-disc-pop-rate');
    rating.innerHTML = `<label>Rating:</label> ${data.ratingRecipe}`; 
    bodyWrap.appendChild(rating);
    
    // Tags section (only if tagsRecipe is populated)
    if (data.tagsRecipe && data.tagsRecipe.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('pp-disc-pop-tag');
        tagsContainer.innerHTML = '<label>Tags:</label>';
        
        // Loop through tags and create elements for each tag
        data.tagsRecipe.forEach(tag => {
            const tagElement = document.createElement('p');
            tagElement.textContent = tag.tag;
            tagsContainer.appendChild(tagElement);
        });
        bodyWrap.appendChild(tagsContainer);
    }
    
    // Append the body container to the popup
    popup.appendChild(bodyWrap);
    
    // Hidden ID field
    const hiddenId = document.createElement('p');
    hiddenId.id = 'hidden-id';
    hiddenId.style.display = 'none';
    hiddenId.textContent = data.id;
    popup.appendChild(hiddenId);
    
    // Button to cart
    const button = document.createElement('div');
    button.classList.add('pp-disc-pop-btn');
    button.textContent = 'Add';
    popup.appendChild(button);

    // Button to exit
    const buttonExit = document.createElement('div');
    buttonExit.classList.add('pp-disc-pop-btn-exit');
    buttonExit.textContent = 'Exit';
    popup.appendChild(buttonExit);
    
    // Append the popup to the body (no overlay div anymore)
    document.body.appendChild(popup);

    button.addEventListener("mousedown", (e) => {
        localStorage.setItem(`food${data.id}`, data.heading);
        popup.style.display = "none"

        const buttonConfirm = document.querySelectorAll(".header-button")
    
        setTimeout(() => {
            buttonConfirm[1].style.backgroundColor = "#1abc9c"
            buttonConfirm[1].style.color = "white"
        }, 100);
    
        setTimeout(() => {
            buttonConfirm[1].style.backgroundColor = "" 
            buttonConfirm[1].style.color = ""  
        }, 1000);

    });

    buttonExit.addEventListener("mousedown", (e) => {
        popup.style.display = "none"
    })
}
// LOADPOPUP FOR VIEWING RECIPE INGREDIENTS AND INSTRUCTIONS ENDS!

// RELOAD WINDOW/RETRIEVE LATEST RECIPES
reloadWindow.parentNode.addEventListener("mousedown", (e) => {
    let baseUrl = window.location.origin;
    window.location.href = baseUrl + '/discover';

})
// CONTRIBUTE WITH RECIPE USER
submitRecipe.parentNode.addEventListener("mousedown", (e) => {
    createRecipe()
})
async function createRecipe() {
    const overlay = document.createElement('div');
    overlay.classList.add('recipe-add-overlay');
    
    const popup = document.createElement('div');
    popup.classList.add('recipe-add-popup');
  
    const bodyWrap = document.createElement('div');
    bodyWrap.classList.add('recipe-add-body-container');

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add('recipe-add-img-wrapper');
    imgWrapper.innerText = "Upload image";
    imgWrapper.addEventListener("mousedown", (e) => {
        imgInput.click();

        const fileInput = document.getElementById('fileInput');

        imgInput.addEventListener('change', (event) => {
            const files = event.target.files;

            if (files.length > 0) {    
                imgWrapper.innerText = "File received ✓";
            }
        });
    });
    bodyWrap.appendChild(imgWrapper);

    const imgInput = document.createElement('input');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.style.display = "none"; 
    imgInput.tabIndex = 1;
    bodyWrap.appendChild(imgInput);

    const headingWrapper = document.createElement('div');
    headingWrapper.classList.add('recipe-add-heading-wrapper');
    const headingInput = document.createElement('input');
    headingInput.classList.add('recipe-add-heading-input');
    headingInput.type = 'text';
    headingInput.tabIndex = 2;
    headingWrapper.appendChild(headingInput);
    bodyWrap.appendChild(headingWrapper);

    const instructionsWrapper = document.createElement('div');
    instructionsWrapper.classList.add('recipe-add-instructions-wrapper');
    const instructionsInput = document.createElement('textarea');
    instructionsInput.classList.add('recipe-add-textarea');
    instructionsInput.tabIndex = 3;
    instructionsWrapper.appendChild(instructionsInput);
    bodyWrap.appendChild(instructionsWrapper);

    const ingredientsWrapper = document.createElement('div');
    ingredientsWrapper.classList.add('recipe-add-ingredients-wrapper');
    const ingredientsInput = document.createElement('textarea');
    ingredientsInput.classList.add('recipe-add-textarea');
    ingredientsInput.tabIndex = 4;
    ingredientsWrapper.appendChild(ingredientsInput);
    bodyWrap.appendChild(ingredientsWrapper);
    
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('recipe-add-tags-container');
    const tagInput = document.createElement('input');
    tagInput.classList.add('recipe-add-tag-input');
    tagInput.type = 'text';
    tagInput.tabIndex = 5;
    tagsContainer.appendChild(tagInput);
    bodyWrap.appendChild(tagsContainer);

    const style = document.createElement('style');
    style.innerHTML = `
        input::placeholder, textarea::placeholder {
            font-style: normal;
            font-size: 1rem;
        }
        input, textarea {
            font-size: 1rem;
            padding-left: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    popup.appendChild(bodyWrap);

    const hiddenId = document.createElement('p');
    hiddenId.id = 'hidden-id';
    hiddenId.style.display = 'none';
    popup.appendChild(hiddenId);

    const submitButton = document.createElement('div');
    submitButton.classList.add('recipe-add-submit-btn');
    submitButton.textContent = 'Submit';
    submitButton.tabIndex = 6;

    const exitButton = document.createElement('div');
    exitButton.classList.add('recipe-add-exit-btn');
    exitButton.textContent = 'Exit';
    exitButton.tabIndex = 7;

    submitButton.addEventListener('click', async () => {
        const file = imgInput.files[0];

        // need more checks here before submitting recipe!

        if(headingInput.value.length === 0 || instructionsInput.value.length === 0 || ingredientsInput.value.length === 0 || tagInput.value.length === 0){
            alert('All fields are mandatory and must be filled out to proceed with the submission.');
            return
        }

        if (file) {
            const base64Image = await getBase64FromFile(file);

            const data = {
                heading: headingInput.value,
                bodyRecipe: instructionsInput.value,
                ingredientRecipe: ingredientsInput.value,
                ratingRecipe: 5,
                tagsRecipe: tagInput.value.split(',').map(tag => ({ tag: tag.trim() })),
                imageRecipe: base64Image
            };

            await submitNewRecipe(data);
            overlay.style.display = 'none';
        } else {
            alert('Please select an image!');
        }
    });

    submitButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            submitButton.click()
        }
    })

    exitButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            overlay.style.display = "none"
        }
    })
    
    exitButton.addEventListener("mousedown", (e) => {
        overlay.style.display = "none";
    });

    overlay.appendChild(popup);
    overlay.appendChild(submitButton);
    overlay.appendChild(exitButton);

    document.body.appendChild(overlay);

    setTimeout(() => {
        headingInput.focus();
    }, 500);
}
async function submitNewRecipe(data) {
    try {
        const response = await fetch('https://localhost:7270/discover', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Failed to submit the recipe');
        }
    } catch (error) {
        console.error('Error creating recipe:', error);
        alert('Failed to create recipe.');
    }
}
function getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            
            reject(error);
        };

       
        reader.readAsDataURL(file);
    });
}

const buttonOpenAddRecipe = document.querySelector(".discover-submit-recipe")
const actualButton = buttonOpenAddRecipe.querySelectorAll("div")

actualButton[0].addEventListener("mousedown", (e) => {
    setTimeout(() => {
        appendEventToInputAddRecipe()
    }, 200);
})

function appendEventToInputAddRecipe(){

    const textArea = document.querySelectorAll(".recipe-add-textarea")
    const tagArea = document.querySelector(".recipe-add-tag-input")
    const headingArea = document.querySelector(".recipe-add-heading-input")

    textArea.forEach((item) => {
        item.addEventListener("focus", (e) => {
            e.target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        })
    })

    tagArea.addEventListener("focus", (e) => {
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    })

    headingArea.addEventListener("focus", (e) => {
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    })

}

// CONTRIBUTE WITH RECIPE USER ENDS!

// Dropshadow on tag scroll

const tagContainer = document.querySelector(".tag-container-items")
const selectionContainer = document.querySelector(".discover-heading-selection")

tagContainer.addEventListener("scroll", (e) => {
    if(tagContainer.scrollTop > 0){

        selectionContainer.style.boxShadow = "0 2px 10px rgba(159, 163, 165, 0.66)";
        

    }else {

        selectionContainer.style.boxShadow = "none";
        tagContainer.style.border = "none"
    }
})

const headerContainer = document.querySelector(".scroll-cntn-dropshadow")
const imageContainer = document.querySelector(".discover-scroll-cntnt")

imageContainer.addEventListener("scroll", (e) => {
    if(imageContainer.scrollTop > 0){

        headerContainer.style.boxShadow = "0 2px 10px rgba(28, 29, 30, 0.89)";
        headerContainer.style.borderBottom = "1px solid rgba(0, 0, 0, 0.2)"

    }else {

        headerContainer.style.boxShadow = "none";
        headerContainer.style.border = "none"
    }
})

// SHOW TAGS ON TAG CLICK!!!

const discoverButtonsContainer = document.querySelector(".discover-submit-recipe")
const discoverButtons = discoverButtonsContainer.querySelectorAll('div')

discoverButtons[2].addEventListener("mousedown", (e) => {

    const i = e.target.querySelectorAll("i")

    if(tagContainer.style.display === "flex"){
        i[1].classList.replace('fa-chevron-up', 'fa-chevron-down');
        tagContainer.style.display = "none"
        selectionContainer.style.boxShadow = "none";
        tagContainer.style.border = "none"
        return
    }

    tagContainer.style.display = "flex"
    i[1].classList.replace('fa-chevron-down', 'fa-chevron-up');

})

// RATING ON STARPRESS

const starRating = document.querySelectorAll(".fa-star")

const recipeDiv = document.querySelectorAll(".discover-recipe-container").forEach((item) => {
    
    item.addEventListener('mousedown', function(event) {

        const id = item.querySelector("#recipe-id")

        loadPopupDiscover(id.innerText.trim())

    });
 
})


// BELOW IS FOR ACTUAL UPDATE OF STARS
starRating.forEach((star, index) => {

    star.addEventListener("mousedown", (e) => {

        e.stopImmediatePropagation();

        const id = star.parentNode;
        const actualId = id.querySelector("#recipe-id");

        fetch(window.location.origin + `/discover/updaterecipe/${actualId.innerText.trim()}/${star.dataset.star}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                console.log("Failed to send rating");
                return Promise.reject('Failed to send rating');
            }
            return response.json();
        })
        .then(response => {
            console.log(response)
            const ratingValue = response;
            const stars = id.querySelectorAll(".fa-star");
            console.log(ratingValue)
            stars.forEach((starElement, i) => {
                if (i < ratingValue) {
                    starElement.classList.replace("fa-regular", "fa-solid");
                } else {
                    starElement.classList.replace("fa-solid", "fa-regular");
                }
            });
        })
        .catch(console.error);

    });

})

// BELOW IS FOR HOVER EFFECT ON STARS
starRating.forEach(star => {

    const currentParent = star.parentNode;
    const newList = currentParent.querySelectorAll(".fa-star");

    let currentRating = 0

    newList.forEach((item) => {
        if(item.classList.contains("fa-solid"))
            currentRating += 1
    })

    newList.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            const starValue = parseInt(item.getAttribute('data-star'))

            newList.forEach(starNested => {
                const currentValue = parseInt(starNested.getAttribute('data-star'))

                if (currentValue <= starValue) {
                    starNested.classList.remove('fa-regular')
                    starNested.classList.add('fa-solid')
                } else {
                    starNested.classList.remove('fa-solid')
                    starNested.classList.add('fa-regular')
                }
            })
        })
    })

    // Below resets to previous state irrespective of update.. to prevent spam
    currentParent.addEventListener('mouseout', () => {
        newList.forEach((item, index) => {
            const starValue = parseInt(item.getAttribute('data-star'))

            if (starValue <= currentRating) {
                item.classList.remove('fa-regular')
                item.classList.add('fa-solid')
            } else {
                item.classList.remove('fa-solid')
                item.classList.add('fa-regular')
            }
        });
    })
})


  


