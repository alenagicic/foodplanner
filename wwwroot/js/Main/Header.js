
// Dropdown

const dropDownGenerate = document.querySelectorAll(".header-button")
const dropDownActual = document.querySelector(".generator-drpd-wrap")
const dropDownItemContainer = document.querySelector(".generator-drpd-items")


dropDownGenerate[1].addEventListener("mouseover", (e) => {

    dropDownActual.style.display = "flex"
    setTimeout(() => {
            dropDownActual.style.opacity = "1"

                while (dropDownItemContainer.firstChild) {
                    dropDownItemContainer.removeChild(dropDownItemContainer.firstChild);
                }

                if (typeof(Storage) !== "undefined") {  
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                                        
                        if (key.startsWith('food')) {
                            const value = localStorage.getItem(key);
                
                            const id = key.replace('food', '');
                                
                            populateCart(id, value);
                            attachEventListenerRemoveItems(id, "")
                        }
                    }
                } else {
                    console.log("localStorage is not supported in this environment.");
                }
                
            
    }, 200);
})

dropDownGenerate[1].addEventListener("mouseout", (e) => {
    dropDownActual.style.display = "none"
    setTimeout(() => {
        dropDownActual.style.opacity = "0"
    }, 200);
})

dropDownActual.addEventListener("mouseover", (e) => {
    dropDownActual.style.display = "flex"
    setTimeout(() => {
        dropDownActual.style.opacity = "1"
    }, 200);
})

dropDownActual.addEventListener("mouseout", (e) => {
    dropDownActual.style.display = "none"
    setTimeout(() => {
        dropDownActual.style.opacity = "0"
    }, 200);
})

// Helper functions

function populateCart(id, header){

    const cart = document.querySelector(".generator-drpd-items")

    const item = document.createElement("p")
    const idItem = document.createElement("p")
    const remove = document.createElement("p")

    remove.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    idItem.style.display = "none"
    idItem.innerText = id

    const wrapper = document.createElement("div")
    
    wrapper.appendChild(item)
    wrapper.appendChild(idItem)
    wrapper.appendChild(remove)

    item.innerText = header
    
    cart.appendChild(wrapper)

    const buttonConfirm = document.querySelectorAll(".header-button")
    

}

function attachEventListenerRemoveItems(id, header){

    const xMark = document.querySelectorAll(".fa-xmark")


    xMark.forEach((item) => {
        item.addEventListener("mousedown", (e) => {
            const wrapperToRemove = e.target.closest('div');
            wrapperToRemove.remove();
            localStorage.removeItem(`food${id}`);
        })
    });
}

// For generator
const GenerateButton = document.querySelector(".generator-drpd-tocart")

GenerateButton.addEventListener("mousedown", (e) => {
    generatorGeneratePDF()
})

function generatorGeneratePDF() {
    const cart = document.querySelector(".generator-drpd-items");
    const wrapperP = cart.querySelectorAll("div");

    const arrayItems = [];

    // Fetch data for each item in the cart
    wrapperP.forEach((item) => {
        const recipeId = item.childNodes[1].innerText;

        fetch(`https://localhost:7270/discover/getrecipe/${recipeId}`, {
            method: 'GET',  
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            arrayItems.push(data);
            if (arrayItems.length === wrapperP.length) {
                generatePDF(arrayItems);
                
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function generatePDF(arrayItems) {
    let htmlContent = '';

    arrayItems.forEach(item => {
        htmlContent += `
            <style>
                /* General Document Styles */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #ffffff;
                    color: #000000;
                    line-height: 1.6;
                    font-size: 12pt;
                }
    
                .page {
                    width: 210mm;
                    height: 297mm; /* A4 Size */
                    padding: 20mm;
                    box-sizing: border-box;
                }
    
                h1 {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 10px;
                    text-align: center;
                    text-transform: uppercase;
                }
    
                .section {
                    margin-bottom: 15mm;
                }
    
                .section p {
                    margin: 5mm 0;
                }
    
                .section strong {
                    font-weight: bold;
                }
    
                .tags {
                    font-style: italic;
                    color: #666;
                }
    
                .ingredients {
                    margin-top: 10mm;
                }
    
                .ingredients div {
                    margin-bottom: 5mm;
                }
    
                .ingredient-item {
                    color: #333;
                    margin-left: 8px;
                    list-style: none;
                }
    
                .image-container {
                    text-align: center;
                    margin-top: 10mm;
                }
    
                .image-container img {
                    max-width: 100%;
                    max-height: 200px;
                    object-fit: contain;
                }
            </style>
    
            <div class="page">
                <h1>${item.heading.toUpperCase()}</h1>
    
                <div class="section">
                    <p><strong>Rating:</strong> ${item.ratingRecipe}</p>
                    <p><strong>Tags:</strong> <span class="tags">${item.tagsRecipe.map(tag => tag.tag).join(', ')}</span></p>
                    <p><strong>Recipe:</strong> ${item.bodyRecipe}</p>
                </div>
    
                <style>

                .ingredients ul {
                    list-style: none;
                    padding-left: 0;
                }
                .ingredients li {
                    margin-bottom: 5px;
                }
                </style>

                ${item.ingredientRecipe ? `
                <div class="section ingredients">
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                    ${item.ingredientRecipe.split(',').map(ingredient => `
                        <li>&#10003; ${ingredient.trim()}</li>
                    `).join('')}
                    </ul>
                </div>
                ` : ''}
    
                ${item.imageRecipe ? `
                    <div class="section image-container">
                        <img src="${item.imageRecipe}" alt="Recipe Image">
                    </div>
                ` : ''}
    
            </div>
        `;
    });

  
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
}



// On screen width 600px change header buttons to icons!


