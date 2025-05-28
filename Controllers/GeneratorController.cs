

using Lifeplanner.Factory;
using Lifeplanner.Models;
using Lifeplanner.Services;
using Lifeplanner.ViewModels;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;


namespace Lifeplanner.Controllers;

[LockControllerIfUserLoggedIn]

[Route("discover")]
public class GeneratorController : Controller{

    private readonly GeneratorServices _service;
    public GeneratorController(GeneratorServices Service){
        _service = Service;
    }

    public IActionResult Index(){
        var result = _service.GetManyRecipeIrrespectiveTag();
        var resultTag = _service.GetManyTags();
        GeneratorViewModel model = new(){
            list = result,
            listTags = resultTag
        };
        return View("Partials/Discover/_DiscoverMain", model);   
    }

    [HttpPost]
    public IActionResult AddRecipe([FromBody]GeneratorModel model){

        var psuedoname = HttpContext.Items["psuedoname"] as string;
        model.Author = psuedoname;
        DateTime today = DateTime.Now;
        model.CreatedDate = today.ToString("yyyy-MM-dd");

        var result = _service.AddRecipe(model);
        if(result != false){
            return Ok();
        }

        return BadRequest();
    }

    [HttpDelete]
    public IActionResult RemoveRecipe(int value){
        var result = _service.RemoveRecipe(value);
        if(result != false){
            return Ok();
        }
        return BadRequest();
    }

    [HttpPut]
    public IActionResult UpdateRecipe([FromBody]GeneratorModel model){
        var result = _service.UpdateRecipe(model);
        if(result != false){
            return Ok();
        }
        return BadRequest();
    }

    [HttpGet("getrecipe/{id}")]
    public IActionResult GetRecipe(int id){
        var result = _service.GetRecipe(id);
        if(result != null){
            return Ok(result);
        }

        return BadRequest();
    }

    [HttpGet("multiple/tag")]
    public IActionResult GetMultipleOnTag(string value){
        var result = _service.GetManyRecipe(value);
        var resultTag = _service.GetManyTags();

        if(result != null){
            return View("Partials/Discover/_DiscoverMain", new GeneratorViewModel(){
                list = result,
                listTags = resultTag
            });   
        }

        return View("Partials/Discover/_DiscoverMain", new GeneratorViewModel());   

    }

    [HttpGet("topcontributors")]
    public IActionResult GetTopContributorsAmount(){

        var result = _service.TopContributors();

        return Ok(result);
    }

    [HttpGet("myrecipes")]
    public IActionResult MyRecipes(){

        var psuedoname = HttpContext.Items["psuedoname"] as string;

        var result = _service.MyRecipes(psuedoname!);

        return Ok(result);

    }

    // Rating system
    [Route("updaterecipe/{generatorId}/{rating}")]
    [HttpPut]
    public IActionResult UpdateRating(int generatorId, int rating){

        var result = _service.UpdateRating(rating, generatorId);
        if (result != 0){
            return Ok(result);
        }

        return BadRequest();
    }

    [Route("updaterecipe/downloads/{generatorId}")]
    [HttpPut]
    public IActionResult UpdateDownloadCount(int generatorId){

        var result = _service.UpdateGeneratorDownloads(generatorId);
        if(result){
            return Ok();
        }

        return BadRequest();

    }

}