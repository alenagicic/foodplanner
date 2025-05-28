using Lifeplanner.Entity;
using Lifeplanner.Factory;
using Lifeplanner.Models;
using Lifeplanner.Services;
using Lifeplanner.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Lifeplanner.Controllers;

[LockControllerIfUserLoggedIn]
public class CommunityController : Controller {

    private readonly CommunityServices _services;

    private readonly CommunityFactory _factory;
    public CommunityController(CommunityServices Services, CommunityFactory Factory) {
        _services = Services;
        _factory = Factory;
    }

    public IActionResult Index(){

        var model = _services.GetAllTopics();
        var resultTopic = _services.GetLatestTopics();

        CommunityViewModel modelList = new();
        modelList.ColumnCookware = new();
        modelList.ColumnGeneral = new();
        modelList.ColumnTipsTricks = new();
        modelList.ColumnRecipes = new();

        if(resultTopic != null){
            modelList.ListCommunity = resultTopic;
        }else {
            modelList.ListCommunity = new();
        }

        foreach(var item in model){
            if(item.Category == "ColumnCookware"){
                modelList.ColumnCookware!.Add(item);
            }
            if(item.Category == "ColumnGeneral"){
                modelList.ColumnGeneral!.Add(item);
            }
            if(item.Category == "ColumnRecipes"){
                modelList.ColumnRecipes!.Add(item);
            }
            if(item.Category == "ColumnTipsTricks"){
                modelList.ColumnTipsTricks!.Add(item);
            }
        }

        return View("Partials/Community/_CommunityMain", modelList);
    }


    [Route("community/{value}")]
    [HttpGet]
    public IActionResult GetTopic(int value){

        var result = _services.GetSingleTopic(value);
        if(result == null){
            return BadRequest();
        }

        result.ViewCount += 1;
        _services.UpdateSingleTopic(result);
        
        return Ok(result);
    }

    [Route("community")]
    [HttpPost]
    public IActionResult SubmitTopic([FromBody]CommunityModel model){

        var psuedoname = HttpContext.Items["psuedoname"] as string;
        model.Author = psuedoname;

        var result = _services.CreateSingleTopic(model);
        if(!result){
            return BadRequest();
        }

        return Ok();
    }

    [HttpPut]
    public IActionResult UpdateTopic([FromBody]CommunityModel model){

        var result = _services.UpdateSingleTopic(model);
        if(!result){
            return BadRequest();
        }

        return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteTopic(int value){

        var result = _services.DeleteSingleTopic(value);
        if(!result){
            return BadRequest();
        }

        return Ok();
    }


    [Route("community/{index}/more/{category}")]
    [HttpGet]
    public IActionResult GrabMoreTopics(int index, string category){

        if(index == 0 || category == null){
            return BadRequest();
        }

        var result = _services.GetMoreTopicsIndexCategory(index, category!);

        if(result != null){

            return Ok(result);
        }

        return BadRequest();

    }

    [Route("community/comment")]
    [HttpPost]
    public IActionResult CreateComment([FromBody]CommentModel model){

        var psuedoname = HttpContext.Items["psuedoname"] as string;

        CommentModel entity = new(){
            Author = psuedoname,
            CommentBody = model.CommentBody,
            CheckedByAuthor = false,
            CommentTime = DateTime.Now.ToString("MM, dd, HH:mm")
        };

        var result = _services.CreateComment(entity, model.Id);
        if(!result){
            return BadRequest();
        }

        return Ok();
    }

    [Route("community/comment/reply/{topicID}/{parentCommentID}")]
    [HttpPost]
    public IActionResult CommentReply([FromBody]CommentModel model, int topicID, int parentCommentID){
        
        var psuedoname = HttpContext.Items["psuedoname"] as string;

        CommentModel entity = new(){
            Author = psuedoname,
            CommentBody = model.CommentBody,
            CheckedByAuthor = false,
            CommentTime = DateTime.Now.ToString("MM, dd, HH:mm")
        };

        var result = _services.CreateCommentOnComment(entity, parentCommentID, topicID);
        if(!result){
            return BadRequest();
        }

        return Ok();

    }

    [Route("community/comment/reply/get/{topicID}/{commentID}")]
    [HttpGet]
    public IActionResult GetCommentReply(int topicID, int commentID){

        var resultGet = _services.GetNestedComments(topicID, commentID);

        return Ok(resultGet);
    }


    [Route("community/comment/replies/notifications")]
    [HttpGet]
    public IActionResult GrabNotifications(){

        var psuedoname = HttpContext.Items["psuedoname"] as string;

        var result = _services.GrabUncheckedMessagesWithReplies(psuedoname!);

        return Ok(result);
    }


    [Route("community/thread/replies/notifications")]
    [HttpGet]
    public IActionResult GrabResponsesThread(){

        var psuedoname = HttpContext.Items["psuedoname"] as string;

        var result = _services.CheckThreadsContainReply(psuedoname!);

        return Ok(result);
    }


    [Route("community/topic/update/notify/{value}")]
    [HttpPut]

    public IActionResult UpdateTopicNotify(int value){

        var result = _services.UpdateTopicNotify(value);
        
        if(result){
            return Ok();
        }

        return BadRequest();
    }


    [Route("community/comment/update/notify/{value}")]
    [HttpPut]

    public IActionResult UpdateCommentNotify(int value){

        var result = _services.UpdateCommentNotify(value);

        if(result){
            return Ok();
        }

        return BadRequest();
    }
}





