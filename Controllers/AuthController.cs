using Lifeplanner.Models;
using Lifeplanner.Services;
using Microsoft.AspNetCore.Mvc;

namespace Lifeplanner.Controllers;

[Route("auth")]
public class AuthController : Controller {

    private readonly AuthServices _services;
    public AuthController(AuthServices Services) {
        _services = Services;
    }


    [Route("signin")]
    public IActionResult SignInView(){
        TempData["header"] = "Sign In";
        return View("Partials/Auth/_Signin");
    }

    [Route("signUpView")]
    public IActionResult SignUpView(){
        TempData["header"] = "Sign Up";
        return View("Partials/Auth/_Signin");
    }

    [HttpPost]
    [Route("signin/submission")]
    public IActionResult SignIn(SignInModel model) {

        var Result = _services.SignIn(model);
        if(Result){
            var resultGetUser = _services.GetUser(model.Username!);
            _services.SignInTime(resultGetUser.PsuedoName!);

            return RedirectToAction("Index", "Home");
        }

        TempData["header"] = "User not found";
        return View("Partials/Auth/_Signin");
    }

    [HttpPost]
    [Route("signup/submission")]
    public IActionResult SignUp(SignInModel model){
        
        if(ModelState.IsValid){
            var result = _services.SignUp(model);

            if(result){
                return RedirectToAction("Index", "Home");
            }
        }

        TempData["header"] = "User already exists";
        return View("Partials/Auth/_Signin", model);
    }

}