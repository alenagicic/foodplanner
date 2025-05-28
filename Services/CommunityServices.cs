using Lifeplanner.Entity;
using Lifeplanner.Factory;
using Lifeplanner.Models;
using Lifeplanner.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Lifeplanner.Services;


public class CommunityServices
{
    private readonly ApplicationDbContext _context;
    private readonly CommunityFactory _factory;
    public CommunityServices(ApplicationDbContext Context, CommunityFactory Factory){
        _context = Context;
        _factory = Factory;
    }

    public List<CommunityModel> GetAllTopics()
    {
        var one = _context.CommunityTable
            .Where(x => x.Category == "ColumnCookware")
            .OrderByDescending(x => x.Id)
            .Include(x => x.Comments)
            .Take(10)
            .ToList();

        var two = _context.CommunityTable
            .Where(x => x.Category == "ColumnGeneral")
            .OrderByDescending(x => x.Id)
            .Include(x => x.Comments)
            .Take(10)
            .ToList();

        var three = _context.CommunityTable
            .Where(x => x.Category == "ColumnRecipes")
            .OrderByDescending(x => x.Id)
            .Include(x => x.Comments)
            .Take(10)
            .ToList();

        var four = _context.CommunityTable
            .Where(x => x.Category == "ColumnTipsTricks")
            .OrderByDescending(x => x.Id)
            .Include(x => x.Comments)
            .Take(10)
            .ToList();

        List<CommunityModel> list = new();

        foreach(var item in one){
            list.Add(_factory.MapEntityToCommunityModel(item));
        }

        foreach(var item in two){
            list.Add(_factory.MapEntityToCommunityModel(item));
        }

        foreach(var item in three){
            list.Add(_factory.MapEntityToCommunityModel(item));
        }

        foreach(var item in four){
            list.Add(_factory.MapEntityToCommunityModel(item));
        }

        return list;
    }

    public List<CommunityModel> GetLatestTopics(){

        var latestItems = _context.CommunityTable
        .OrderByDescending(item => item.Id)
        .Take(10)
        .ToList();

        List<CommunityModel> list = new();
        foreach(var item in latestItems){
            list.Add(_factory.MapEntityToCommunityModel(item));
        }
        
        return list;
    }

    public CommunityModel GetSingleTopic(int Id)
    {

        var topic = _context.CommunityTable
            .Where(x => x.Id == Id)
            .FirstOrDefault();

        var allComments = _context!.CommunityTable
            .Where(x => x.Id == Id)
            .SelectMany(x => x.Comments!)
            .ToList();

        var groupedComments = allComments
            .Where(c => c.ParentCommentId == null)
            .Select(c => new CommentModel
            {
                Id = c.Id,
                Author = c.Author,
                CommentBody = c.CommentBody,
                Reply = MapNestedToModel(c.Id, allComments)
            })
            .ToList();

        groupedComments.Reverse();


        try{
        
            CommunityModel model = new();
            model.Author = topic!.Author;
            model.Category = topic.Category;
            model.Comments = groupedComments;
            model.Id = topic.Id;
            model.Rating = topic.Rating;
            model.Topic = topic.Topic;
            model.TopicBody = topic.TopicBody;
            model.CommentPost = topic.CommentPost;
            model.ViewCount = topic.ViewCount;

            return model;

        }catch{

            return new CommunityModel();

        }
    
    }

    public List<CommunityModel> GetMoreTopicsIndexCategory(int index, string category){
        

        var query = _context.CommunityTable
                    .Where(e => e.Category!.ToLower() == category.ToLower())
                    .OrderByDescending(e => e.Id)
                    .Skip(index)
                    .Take(10)
                    .ToList();

        List<CommunityModel> listReturn = new();

        foreach(var items in query){
            var resultMap = _factory.MapEntityToCommunityModel(items);
            listReturn.Add(resultMap);
        }

        return listReturn;
    }

    private List<CommentEntity> GetNestedComments(int parentId, List<CommentEntity> allComments)
    {
        var nested = allComments
            .Where(c => c.ParentCommentId == parentId)
            .ToList();

        foreach (var comment in nested)
        {
            comment.Reply = GetNestedComments(comment.Id, allComments);
        }

        return nested;
    }

    private List<CommentModel> MapNestedToModel(int parentId, List<CommentEntity> allComments)
    {
    var nestedComments = allComments
        .Where(c => c.ParentCommentId == parentId) 
        .ToList();

    var commentModels = new List<CommentModel>();

    foreach (var comment in nestedComments)
    {
        var commentModel = new CommentModel
        {
            Id = comment.Id,
            Author = comment.Author,
            CommentBody = comment.CommentBody,
            Reply = MapNestedToModel(comment.Id, allComments) 
        };

        commentModels.Add(commentModel);
    }

    return commentModels;
    }

    public bool DeleteSingleTopic(int Id)
    {
        var result = _context.CommunityTable.Where(x => x.Id == Id).FirstOrDefault();

        _context.RemoveRange(result!.Comments!);

        _context.CommunityTable.Remove(result);

        var resultDelete = _context.SaveChanges();

        if(resultDelete != 0){
            return true;
        }
        
        return false;
    }

    public bool UpdateSingleTopic(CommunityModel model)
    {

        if(model == null){
            return false;
        }

        var item = _context.CommunityTable.Where(x => x.Id == model.Id).FirstOrDefault();

        if(item == null){
            return false;
        }

        var mapResult = _factory.MapCommunityModelToEntity(model);

        item!.Author = mapResult.Author;
        item.CommentPost = mapResult.CommentPost;
        item.Id = mapResult.Id;
        item.Rating = mapResult.Rating;
        item.Topic = mapResult.Topic;
        item.TopicBody = mapResult.TopicBody;
        item.ViewCount = mapResult.ViewCount;

        _context.CommunityTable.Update(item);
        
        var resultUpdate = _context.SaveChanges();
        if(resultUpdate != 0){
            return true;
        }

        return false;
    }

    public bool CreateSingleTopic(CommunityModel model)
    {
        _context.CommunityTable.Add(_factory.MapCommunityModelToEntity(model));

        var result = _context.SaveChanges();
        if(result != 0){
            return true;
        }

        return false;
    }   

    public bool CreateComment(CommentModel model, int topicId){
        
        var entity = new CommentEntity(){
            Author = model.Author,
            CommentBody = model.CommentBody,
            Id = model.Id,
            CommunityId = topicId,
            CheckedByAuthor = model.CheckedByAuthor,
            CommentTime = model.CommentTime,
        };

        _context.CommentTable.Add(entity);

        // Notify thread "owner" of new reply
        var getTopic = _context.CommunityTable
                        .Where(x => x.Id == topicId).FirstOrDefault();

        if(getTopic != null){
            getTopic!.NotifyOwner = true;
            _context.CommunityTable.Update(getTopic!);
        }

        var result = _context.SaveChanges();
        if(result != 0){
            return true;
        }

        return false;
    }

    public bool CreateCommentOnComment(CommentModel model, int parentCommentId, int topicId){

        var resultGet = _context.CommentTable.Where(x => x.Id == parentCommentId).FirstOrDefault();

        if(resultGet != null){

            List<CommentEntity> list = new(){};

            var entity = new CommentEntity(){
                Author = model.Author,
                CommentBody = model.CommentBody,
                // References the TOPIC
                CommunityId = topicId,
                // References the ParentCOMMENT
                ParentCommentId = parentCommentId,
                CheckedByAuthor = model.CheckedByAuthor,
                CommentTime = model.CommentTime,
                Reply = new()
            };

            list.Add(entity);

            resultGet.Reply = list;
            
            // Notifies the comment "owner" that a new reply has been added!
            resultGet.CheckedByAuthor = false;

            _context.CommentTable.Update(resultGet);


            // Notify thread "owner" of new reply
            var getTopic = _context.CommunityTable
                        .Where(x => x.Id == topicId).FirstOrDefault();

            if(getTopic != null){
                getTopic!.NotifyOwner = true;
                _context.CommunityTable.Update(getTopic!);
            }

            var result = _context.SaveChanges();

            if(result > 0){
               return true;
            }
         
        }

        return false;
    }

    public CommentModel GetNestedComments(int topicID, int commentId){

        var resultGet = _context.CommentTable
            .Where(x => x.CommunityId == topicID && x.Id == commentId)
            .ToList();


        CommentModel model = new();

        return model;
    }

    public List<CommentModel> GrabUncheckedMessagesWithReplies(string username){

        List<CommentModel> comments = new();

        // GRAB ALL COMMENTS FROM USER AND IF "CHECKED" IS FALSE
        var resultChecked = _context.CommentTable
            .Where(x => x.CheckedByAuthor == false && x.Author!.ToLower() == username.ToLower()).ToList();

        // ABOVE IS THE PARENTCOMMENT
        if(resultChecked != null){

            foreach(var item in resultChecked){
                // THIS CHECKS IF (UNCHECKED) PARENTCOMMENT (ABOVE) HAS ANY() CHILD
                bool hasNestedComment = _context.CommentTable
                                        .Any(x => x.ParentCommentId == item.Id);
                
                if(hasNestedComment){
                    // APPEND THE COMMENT THAT CONTAINS THE REPLIES
                    comments.Add(new CommentModel(){
                        Id = item.Id,
                        CommentTime = item.CommentTime,
                        Author = item.Author,
                        CheckedByAuthor = item.CheckedByAuthor,
                        CommentBody = item.CommentBody,
                        TopicId = item.CommunityId

                    });

                }
            }

        }

        // RETURN THE LIST OF COMMENTS ASSOCIATED WITH THE USER THAT CONTAINS REPLIES
        return comments;

    }

    public List<Array> CheckThreadsContainReply(string username){

        // Grab last five topics created by username
        var lastFiveItems = _context.CommunityTable
                        .Where(x => x.Author!.ToLower() == username.ToLower() && x.NotifyOwner == true)
                        .OrderByDescending(x => x.Id)
                        .Take(5)
                        .Select(x => new { x.Id, x.Topic })
                        .ToList();

        List<Array> TopicsWithReplies = new();

        if(lastFiveItems != null){
            foreach(var item in lastFiveItems){

                TopicsWithReplies.Add(new string[] { item.Id.ToString(), item.Topic!.ToString() });
                
            }
        }

        return TopicsWithReplies;
    }

    public bool UpdateTopicNotify(int id){

        var result = _context.CommunityTable.Where(x => x.Id == id).FirstOrDefault();

        result!.NotifyOwner = false;

        _context.CommunityTable.Update(result);

        var resultUpdate = _context.SaveChanges();

        if(resultUpdate > 0){
            return true;
        }

        return false;
    }

    public bool UpdateCommentNotify(int id){

        var result = _context.CommentTable.Where(x => x.Id == id).FirstOrDefault();

        result!.CheckedByAuthor = true;

        _context.CommentTable.Update(result);

        var resultUpdate = _context.SaveChanges();

        if(resultUpdate > 0){
            return true;
        }

        return false;
    }
}