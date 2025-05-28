using Lifeplanner.Entity;
using Lifeplanner.Factory;
using Lifeplanner.Models;
using Lifeplanner.Services;
using Lifeplanner.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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

    [HttpPost]
    [Route("changepass/submission")]
    public IActionResult ChangePass(IndexViewModel model){

        var resultGet = _services.GetUser(model.Email!);

        if(model.Password != resultGet.Password){
            resultGet.Password = model.Password;
            var result = _services.UpdateUser(resultGet);
            if(result){
                TempData["passwordError"] = "Successfully changed password";
                return RedirectToAction("index", "home");
            }
        }

        TempData["passwordError"] = "Failed to change password";
        return RedirectToAction("index", "home");

    }

    [HttpPost]
    [Route("changeusername/submission")]
    public IActionResult ChangeUsername(IndexViewModel model){

        var checkIfPsuedoExists = _services.CheckIfPsuedoExists(model.Username!);
        if(checkIfPsuedoExists){
            TempData["usernameError"] = "Username already exists";
            return RedirectToAction("index", "home");
        }

        var resultGet = _services.GetUser(model.Email!);

        if(model.Username != resultGet.PsuedoName){
            resultGet.PsuedoName = model.Username;
            var result = _services.UpdateUser(resultGet);
            if(result){
                TempData["usernameError"] = "Successfully changed username";
                return RedirectToAction("index", "home");
            }
        }

        TempData["usernameError"] = "Failed to change username";
        return RedirectToAction("index", "home");
    }

}