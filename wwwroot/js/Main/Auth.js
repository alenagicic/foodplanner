const signinInputs = document.querySelectorAll(".signin-inputs")
const dangerFields = document.querySelectorAll(".text-danger")
const submissionButton = document.querySelectorAll(".signin-btn")
const signinForm = document.querySelector(".signin-form")

signinInputs[0].addEventListener("keyup", (e) => {
   

    if(e.target.value.length < 8){

        if(!isValidEmail()){
            dangerFields[0].innerText = `Invalid email format`
            dangerFields[0].style.display = "flex"
            dangerFields[0].style.fontSize = "0.8rem"
        }

    }else{
        dangerFields[0].style.display = "none"
    }

})

signinInputs[1].addEventListener("keyup", (e) => {
    
    if(!isValidPass(signinInputs[1].value)){
        dangerFields[1].style.display = "flex"
        dangerFields[1].style.fontSize = "0.8rem"
        dangerFields[1].innerText = "Password invalid: min 8 chars, one uppercase, one special character"
    }else {
        dangerFields[1].style.display = "none"
    }

})

signinForm.addEventListener("submit", (e) => {

    const resultPass = isValidPass(signinInputs[1].value);
    const resultEmail = isValidEmail(signinInputs[0].value);
  
    if (!resultPass || !resultEmail) {
      e.preventDefault();
      return;
    }
    
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPass(password){
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
}
