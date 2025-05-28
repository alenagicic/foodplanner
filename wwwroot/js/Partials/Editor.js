// Populate the textarea on load
window.onload = () => {
    let something = document.querySelector(".food-a4")

    something.style.backgroundColor = "whitesmoke"
    something.focus()
    
}

let mainEditor = document.querySelector(".food-a4")

let redoStack = [];

let counter

// You should be able to unclick bold and italic, etc..

// Undo
document.querySelector(".fa-rotate-left").addEventListener("mousedown", (e) => {

    if(counter === undefined){

        counter = redoStack.length
    }

    if(redoStack[counter - 1] == undefined){

        setTimeout(() => {
            mainEditor.focus()
        }, 200);


        mainEditor.value = ""
        
        return 
        
    }

    console.log("last")
    console.log(counter)

    mainEditor.value = redoStack[counter - 1]

    counter = counter - 1

    setTimeout(() => {
        mainEditor.focus()
    }, 200);

   

})
// Redo
document.querySelector(".fa-rotate-right").addEventListener("mousedown", (e) => {

    if(counter === undefined){
        mainEditor.textContent = mainEditor.value
        setTimeout(() => {
            mainEditor.focus()
        }, 200);

        return 
    }

    if(redoStack[counter + 1] == undefined){
        
        
        mainEditor.value = mainEditor.value

        
        setTimeout(() => {
            mainEditor.focus()
        }, 200);

        return 
    }

    mainEditor.value = redoStack[counter + 1]

    counter += 1

    
    setTimeout(() => {
        mainEditor.focus()
    }, 200);


})
// Bullets
document.querySelector(".fa-list-ul").addEventListener("mousedown", (e) => {

    // If anything is selected, bullet that
    // If nothing is selected just add a bullet


    let selectionStart = mainEditor.selectionStart

    let selectionEnd = mainEditor.selectionEnd

    let beforeSelect = mainEditor.value.substring(0, selectionStart)

    let afterSelect = mainEditor.value.substring(selectionEnd)

    let actualSelect = mainEditor.value.substring(selectionStart, selectionEnd)

    let newValue = "*  " + actualSelect


    if(mainEditor.value.indexOf("\n") !== -1 && selectionStart !== selectionEnd){


        let newList = actualSelect.split("\n")
        let editedList = newList.map(x => "*  " + x)

        mainEditor.value = beforeSelect + editedList.join("\n") + afterSelect

        return
    }

    mainEditor.value = beforeSelect + newValue + afterSelect

    setTimeout(() => {
        mainEditor.focus()
    }, 200);

 

})
// Italic
document.querySelector(".fa-italic").addEventListener("mousedown", (e) => {
    

    if (mainEditor.style.fontStyle !== "italic"){
        mainEditor.style.fontStyle = "italic"
    }else {
        mainEditor.style.fontStyle = "normal"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);

    
})
// Bold
document.querySelector(".fa-bold").addEventListener("mousedown", (e) => {
   

    if (mainEditor.style.fontWeight !== "bold"){
        mainEditor.style.fontWeight = "bold"
    }else {
        mainEditor.style.fontWeight = "500"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);

   
})
// Underline
document.querySelector(".fa-underline").addEventListener("mousedown", (e) => {


    if (mainEditor.style.textDecoration !== "underline"){
        mainEditor.style.textDecoration = "underline"
    }else {
        mainEditor.style.textDecoration = "none"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Text align-left
document.querySelector(".fa-align-left").addEventListener("mousedown", (e) => {
    
    
    

    if (mainEditor.style.textAlign !== "left"){
        mainEditor.style.textAlign = "left"
    }else {
        mainEditor.style.textAlign = "unset"
    }



    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Text align-center
document.querySelector(".fa-align-center").addEventListener("mousedown", (e) => {
    
    if (mainEditor.style.textAlign !== "center"){
        mainEditor.style.textAlign = "center"
    }else {
        mainEditor.style.textAlign = "unset"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Text aling-right
document.querySelector(".fa-align-right").addEventListener("mousedown", (e) => {
    
    if (mainEditor.style.textAlign !== "right"){
        mainEditor.style.textAlign = "right"
    }else {
        mainEditor.style.textAlign = "unset"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Tablistener
mainEditor.addEventListener("keydown", (e) => {

    if (e.key === "Tab") {
        e.preventDefault()

        applyTabIndent()

        setTimeout(() => {
            mainEditor.focus()
        }, 200);

        moveCaretToEnd()

    }
  
})
// Fonttype
document.querySelector(".editor-text-fonttype").addEventListener("change", (e) => {
  
    if(e.target.value === "font-formal"){
        mainEditor.style.fontFamily = "Times New Roman, serif"
    }
    if(e.target.value === "font-impress"){
        mainEditor.style.fontFamily = "Roboto, sans-serif"
    }
    if(e.target.value === "font-elegant"){
        mainEditor.style.fontFamily = "Georgia, serif"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Fontsize
document.querySelector(".editor-text-size").addEventListener("change", (e) => {
    
    if(e.target.value === "font-16"){
        mainEditor.style.fontSize = "16px"
    }
    if(e.target.value === "font-14"){
        mainEditor.style.fontSize = "14px"
    }
    if(e.target.value === "font-12"){
        mainEditor.style.fontSize = "12px"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
// Fontcolor
document.querySelector(".editor-text-color").addEventListener("change", (e) => {
      
    if(e.target.value === "font-brown"){
        mainEditor.style.color = "#764e23"
    }
    if(e.target.value === "font-black"){
        mainEditor.style.color = "#000000"
    }
    if(e.target.value === "font-purple"){
        mainEditor.style.color = "#9370DB"
    }

    setTimeout(() => {
        mainEditor.focus()
    }, 200);
})
//Undo/Redo Listener
mainEditor.addEventListener("keydown", (e) => {


    if (e.key === " "){

        redoStack.push(mainEditor.value)

        if (redoStack.length > 10){
            redoStack.shift()
        }
   
    }

 

})
//Markdown and delete Listener
mainEditor.addEventListener("selectionchange", (e) => {
    
    if (e.key === "Backspace"){

        redoStack.push(mainEditor.textContent)

        if (redoStack.length > 10){
            redoStack.shift()
    
        }
   
        console.log("redostack")
    }
})




