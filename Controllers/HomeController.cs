using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Lifeplanner.Models;
using Lifeplanner.Services;

namespace Lifeplanner.Controllers;

[LockControllerIfUserLoggedIn]

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly AuthServices _servicesAuth;

    public HomeController(ILogger<HomeController> logger, AuthServices servicesAuth)
    {
        _logger = logger;
        _servicesAuth = servicesAuth;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Create()
    {
        return View("Views/Shared/Partials/_Create.cshtml");
    }

    public IActionResult Browse()
    {
        return View("Views/Shared/Partials/_Browse.cshtml");
    }

    public IActionResult ClearCookie()
    {
        Response.Cookies.Delete("AuthToken");

        return RedirectToAction("index", "home");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
    
}
