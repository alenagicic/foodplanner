import './popup.js';
import { createPopup, populateCartNoGenerate, populateErrorMessage, populateImageUpload, populateSuccessMessage, removePopup } from './popup.js';


// Below is for tabbing between divs

const ShoppingTabs = document.querySelectorAll(".shopping-tabs-items")

const ShoppingMain = document.querySelectorAll(".shopping-tab-content")

const menuShopping = document.querySelectorAll(".shopping-tab-inner-menu")

const ShoppingMainContent = document.querySelectorAll(".shopping-tab-inner-content-input")

const inputDiv = document.querySelectorAll(".shopping-tab-inner-content-input-deco")

const inputOne = document.querySelectorAll(".input-shopping-one")

const inputTwo = document.querySelectorAll(".input-shopping-two")

const inputThree = document.querySelectorAll(".input-shopping-three")

const currentSection = document.querySelectorAll(".shopping-current")

const shoppingHeaders = document.querySelectorAll(".cart-divs-header")

const cartDivs = document.querySelectorAll(".cart-div-main")

const cartSubmit = document.querySelector(".create-cart-btn")


window.onload = () => {

  // Below sets the tab colors
  let colors = generatePastelPalette()

  // Shows the first window
  ShoppingMain[0].style.display = "flex"
  ShoppingMain[0].style.backgroundColor = colors[0]
  ShoppingTabs[0].style.backgroundColor = "#dcdcdc"
  ShoppingTabs[0].style.color = "#2c3e50"

  inputThree.forEach((item) => {
    item.placeholder = "Enter adds to cart!"
  });

  setTimeout(() => {
    inputOne[0].focus()
  }, 100);


  let action = document.getElementById("shopping-api-action")

  let apiUrl = document.getElementById("shopping-api-url")

  if(action.innerText.trim().toLowerCase() == "post"){
  
    // Add eventlistener to the submit button so it knows its supposed to createNew

    cartSubmit.addEventListener("mousedown", (e) => {
      createPopup()
      populateCartNoGenerate()

      let wrapperSubmit = document.querySelector(".cart-populate-noGen")
      let inputSubmit = wrapperSubmit.querySelector("input")
      wrapperSubmit.querySelector("button").addEventListener("mousedown", (e) => {
        collectShoppingDataFromFields("POST", apiUrl.innerText, 100, inputSubmit.value)

        removePopup()
        createPopup()
        populateSuccessMessage()
        setTimeout(() => {
            removePopup()
            setTimeout(() => {
                window.location.reload()
            }, 100);
        }, 2600);
 

      })
   
    })
  }
  
  if(action.innerText.trim().toLowerCase()  == "update"){
    // Get first
    populateShoppingDataFields(apiUrl.innerText, "")

    cartSubmit.innerText = "Update Cart"
    
    cartSubmit.addEventListener("mousedown", (e) => {
      let Id = currentSection[currentSection.length - 1].innerText.split(",")

      collectShoppingDataFromFields("PUT", apiUrl.innerText, 0, "")

      
        createPopup()
        populateSuccessMessage()
        setTimeout(() => {
            removePopup()
            setTimeout(() => {
                window.location.reload()
            }, 100);
        }, 2600);
    })
    
  }


}


function collectShoppingDataFromFields(method, url, id, shoppingHeader){

  let greens = []
  let refrigerated = []
  let frozen = []
  let meat = []
  let cleaning = []
  let pantry = []

  cartDivs[0].querySelectorAll("p").forEach((item) => {
    greens.push(item.innerText)
  })
  cartDivs[1].querySelectorAll("p").forEach((item) => {
    refrigerated.push(item.innerText)
  })
  cartDivs[2].querySelectorAll("p").forEach((item) => {
    frozen.push(item.innerText)
  })
  cartDivs[3].querySelectorAll("p").forEach((item) => {
    meat.push(item.innerText)
  })
  cartDivs[4].querySelectorAll("p").forEach((item) => {
    cleaning.push(item.innerText)
  })
  cartDivs[5].querySelectorAll("p").forEach((item) => {
    pantry.push(item.innerText)
  })


  const newModel = 
  {
    Id: id,
    ShoppingHeader: shoppingHeader,
    GreenSection: greens.join(","),
    Refrigerated: refrigerated.join(","),
    Frozen: frozen.join(","),
    Meat: meat.join(","),
    Cleaning: cleaning.join(","),
    Pantry: pantry.join(","),
    ApiUrl: "",
    TypeAction: ""
    
  }

  fetch(url, {
    method: method,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newModel),
  })
  .then(response => response.json())
  .then(data => {

    console.log(data)
 
  })
  .catch(error => {
      console.error('Error:', error);
  });

}

function populateShoppingDataFields(url, body){
  fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {

    let id = data.id;
    let greens = data.greenSection?.split(",");
    let refrigerated = data.refrigerated?.split(",");
    let frozen = data.frozen?.split(",");
    let meat = data.meat?.split(",");
    let cleaning = data.cleaning?.split(",");
    let pantry = data.pantry?.split(",");

    greens?.forEach((item) => { 
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item; 
      cartDivs[0].appendChild(text);
    });

    refrigerated?.forEach((item) => {
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item; 
      cartDivs[1].appendChild(text);
    });

    frozen?.forEach((item) => {
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item;
      cartDivs[2].appendChild(text);
    });

    meat?.forEach((item) => {
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item;
      cartDivs[3].appendChild(text);
    });

    cleaning?.forEach((item) => {
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item;
      cartDivs[4].appendChild(text);
    });

    pantry?.forEach((item) => {
      const text = document.createElement("p");
      text.classList.add("cart-divs-paragraphs");
      text.innerText = item; 
      cartDivs[5].appendChild(text);
    });

    currentSection[6].innerText = `Currently: Cart (${data.shoppingHeader} - ID: ${id})`;
 

    setTimeout(() => {
      ShoppingTabs[ShoppingTabs.length - 1].style.backgroundColor = "#1abc9c"
      setTimeout(() => {
        ShoppingTabs[ShoppingTabs.length - 1].style.backgroundColor = "transparent"
      }, 1000);
    }, 100);

  })
  .catch(error => {
      console.error('Error:', error);
  });

}


// Below colors the entire thing
ShoppingTabs.forEach((item, index) => {
  item.addEventListener("mousedown", (e) => {

    let pastelArray = generatePastelPalette()

    let colorTab

    for (var i = 0; i < ShoppingMain.length; i++){
        ShoppingMain[i].style.display = "none"

        ShoppingTabs[i].style.backgroundColor = ""
        ShoppingTabs[i].style.color =  ""
    }

    
    colorTab = pastelArray[index]

    ShoppingMain[index].style.display = "flex"
    ShoppingMain[index].style.backgroundColor = colorTab

    item.style.backgroundColor = "#dcdcdc"
    item.style.color = "#2c3e50"
    

    shoppingHeaders.forEach((item) => {
        item.style.backgroundColor = colorTab
    });

     // Focuses the inputs
  setTimeout(() => {

    // This will fail on CART select

    if(index > 5){
      return
    }

    let inputValues = inputDiv[index].querySelectorAll("input")

    inputValues[0].focus()


  }, 100);
    
  })

});

// Input validation and submission
inputDiv.forEach((div, index) => {
  div.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

      if(e.target.classList.contains('input-shopping-two')){
        return 
      }
       
      if(inputOne[index].value === "" || inputThree[index].value === ""){
        
        setTimeout(() => {
          ShoppingTabs[6].style.backgroundColor = "#FF0000"

          setTimeout(() => {
              ShoppingTabs[6].style.backgroundColor = "transparent"


          }, 800);

        }, 100);

        return

      }

      // Check if the focused element is an input inside the current div
      const focusedInput = div.querySelector(":focus");

      // If an input inside the div is focused
      if (focusedInput && focusedInput.tagName === "INPUT") {

        let inputValues = div.querySelectorAll("input")
        let selectValue = div.querySelector("select")


        const text = document.createElement("p");

        text.classList.add("cart-divs-paragraphs");

        text.textContent = `${inputValues[0].value.toLowerCase()} ${selectValue.value.toLowerCase()} ${inputValues[1].value.toLowerCase()}`

        cartDivs[index].appendChild(text);

        inputValues[0].value = ""
        inputValues[1].value = ""
        selectValue.selectedIndex = 0

        inputValues[0].focus()

        setTimeout(() => {
              ShoppingTabs[6].style.backgroundColor = "#1abc9c"

              setTimeout(() => {
                  ShoppingTabs[6].style.backgroundColor = "transparent"


              }, 800);
    
        }, 100);

      

      }

    }})
});

// Below is supporting functions
function generatePastelPalette() {
  return  [
    "#dcdcdc",
    "#dcdcdc", 
    "#dcdcdc", 
    "#dcdcdc", 
    "#dcdcdc", 
    "#dcdcdc", 
    "#dcdcdc",
  ];
}
