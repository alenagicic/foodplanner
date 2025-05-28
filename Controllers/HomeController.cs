using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Lifeplanner.Models;
using Lifeplanner.ViewModels;
using Lifeplanner.Services;

namespace Lifeplanner.Controllers;
[LockControllerIfUserLoggedIn]

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly CommunityServices _servicesCom;
    private readonly GeneratorServices _servicesGen;
    private readonly AuthServices _servicesAuth;

    public HomeController(ILogger<HomeController> logger, AuthServices servicesAuth, GeneratorServices servicesGen, CommunityServices servicesCom)
    {
        _logger = logger;
        _servicesCom = servicesCom;
        _servicesGen = servicesGen;
        _servicesAuth = servicesAuth;
    }

    public IActionResult Index()
    {

        var resultTopic = _servicesCom.GetLatestTopics();
        var resultRecipe = _servicesGen.GetLatestRecipes();

        var username = HttpContext.Items
                .Where(x => x!.Key.ToString() == "Username")
                .Select(x => x.Value)            
                .FirstOrDefault() as string;  

        var resultUser = _servicesAuth.GetUser(username!);

        IndexViewModel model = new(){
            Email = resultUser.Username,
            Password = resultUser.Password,
            Username = resultUser.PsuedoName,
            ListCommunity = resultTopic,
            ListGen = resultRecipe
        };

        return View(model);
    }

    public IActionResult ClearCookie()
    {
        Response.Cookies.Delete("AuthToken");

        return RedirectToAction("index", "home");
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
