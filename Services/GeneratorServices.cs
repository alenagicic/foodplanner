using Lifeplanner.Entity;
using Lifeplanner.Factory;
using Lifeplanner.Models;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;

namespace Lifeplanner.Services;

public class GeneratorServices{


    private readonly ApplicationDbContext _context;
    private readonly GeneratorMapper _mapper;
    public GeneratorServices(ApplicationDbContext Context, GeneratorMapper Mapper){
        _context = Context;
        _mapper = Mapper;
    }

    public bool AddRecipe(GeneratorModel model){

        var map = _mapper.MapModelToEntity(model);

        // Set initial rating to three
        map.RatingRecipe = 5;

        _context.GeneratorTable.Add(map);

        var result = _context.SaveChanges();
        if (result != 0){
            return true;
        }

        return false;
    }

    public bool RemoveRecipe(int id){

        var item = _context.GeneratorTable.Where(x => x.Id == id).FirstOrDefault();

        _context.GeneratorTable.Remove(item!);
        
        var result = _context.SaveChanges();
        if(result != 0){
            return true;
        }

        return false;
    }

    public bool UpdateRecipe(GeneratorModel model){

        var item = _context.GeneratorTable.Where(x => x.Id == model.Id).FirstOrDefault();

        List<TagsEntity> tags = new();

        foreach(var items in model.TagsRecipe!){
            TagsEntity entity = new();

            entity.Id = items!.Id;
            entity.Tag = items.Tag;
        }

        item!.BodyRecipe = model.BodyRecipe;
        item.Heading = model.Heading;
        item.ImageRecipe = model.ImageRecipe;
        item.RatingRecipe = model.RatingRecipe;
        item.TagsRecipe = tags;

        _context.GeneratorTable.Update(item);

        var result = _context.SaveChanges();
        if(result != 0){
            return true;
        }

        return false;

    }

    public GeneratorModel GetRecipe(int id){
        var result = _context.GeneratorTable.Where(x => x.Id == id)
        .Include(x => x.TagsRecipe)
        .FirstOrDefault();
        var mapped = _mapper.MapEntityToModel(result!);

        return mapped;
    }

    public List<GeneratorModel> GetManyRecipe(string tag)
    {
        // Get all generator IDs associated with the given tag
        var resultTags = _context.TagTable
                                .Where(x => x.Tag!.ToLower() == tag.ToLower())
                                .Select(x => x.GeneratorId)
                                .ToList();

        // Fetch the generators associated with those IDs
        var generators = _context.GeneratorTable
                                .Where(x => resultTags.Contains(x.Id))
                                .ToList() 
                                .Distinct()
                                .OrderBy(x => Guid.NewGuid()) 
                                .Take(20) 
                                .ToList();

        List<GeneratorModel> models = new();
        foreach(var item in generators)
        {
            models.Add(_mapper.MapEntityToModel(item)); 
        }
        
        return models;
    }

    public List<GeneratorModel> GetManyRecipeIrrespectiveTag(){

        List<GeneratorModel> listmodel = new();
        var resultSearch = _context.GeneratorTable
            .OrderBy(r => EF.Functions.Random())
            .Take(21)
            .ToList();

        foreach(var item in resultSearch){
            listmodel.Add(_mapper.MapEntityToModel(item));
        }

        return listmodel;
    }

    public List<TagsModel> GetManyTags()
    {
        var allTags = _context.TagTable.ToList();

        var uniqueTags = allTags
            .GroupBy(x => x.Tag)
            .Select(group => group.First())
            .ToList();

        var shuffledTags = uniqueTags.OrderBy(x => Guid.NewGuid()).Take(60).ToList();

        List<TagsModel> listModel = new();
        foreach (var item in shuffledTags)
        {
            TagsModel tags = new()
            {
                Id = item.Id,
                Tag = item.Tag
            };
            listModel.Add(tags);
        }

        return listModel;
    }

    public List<GeneratorModel> GetLatestRecipes(){

        var latestItems = _context.GeneratorTable
        .OrderByDescending(item => item.Id)
        .Take(10)
        .ToList();

        List<GeneratorModel> List = new();

        foreach(var item in latestItems){
            List.Add(_mapper.MapEntityToModel(item));
        }

        return List;
    }

    public List<Array> TopContributors(){

        var topUsernames = _context.GeneratorTable
                            .GroupBy(x => x.Author)
                            .Select(g => new  
                            {
                                Username = g.Key,
                                Count = g.Count()
                            })
                            .OrderByDescending(x => x.Count) 
                            .Take(5)   
                            .ToList();     

        List<Array> ListContributors = new();

        foreach (var item in topUsernames)
        {
            ListContributors.Add(new string[] {$"{item.Username}", $"{item.Count}"});
        }

        return ListContributors;
    }

    public List<GeneratorModel> MyRecipes(string username){

        var result = _context.GeneratorTable
                     .Where(x => x.Author!.ToLower() == username.ToLower())
                     .ToList();

        List<GeneratorModel> list = new();

        foreach(var item in result){
            var resultMap = _mapper.MapEntityToModel(item);
            list.Add(resultMap);
        }

        return list;
        
    }

    public int UpdateRating(int rating, int generatorId){

        var result = _context.GeneratorTable.Where(x => x.Id == generatorId).FirstOrDefault();

        if(result == null){
            return 0;
        }

        if(result.AmountRatings == null){
            result.AmountRatings = 0;
        }

        var newRating = CalculateNewRating
                        (result!.RatingRecipe.GetValueOrDefault(), 
                        result.AmountRatings.GetValueOrDefault(), 
                        rating);   

        result.RatingRecipe = newRating;
        result.AmountRatings += 1;

        _context.GeneratorTable.Update(result);

        var resultUpdate = _context.SaveChanges();

        if(resultUpdate > 0){
            return Convert.ToInt32(result.RatingRecipe);
        }

        return 0;
    }

    public bool UpdateGeneratorDownloads(int generatorId){
        var result = _context.GeneratorTable.Where(x => x.Id == generatorId).FirstOrDefault();

        if(result == null){
            return false;
        }

        result!.NumberDownloads += 1;

        _context.GeneratorTable.Update(result);

        var resultUpdate = _context.SaveChanges();

        if(resultUpdate > 0){
            return true;
        }

        return false;

    }

    static double CalculateNewRating(double currentRating, int numRatings, double newRating)
    {
        double newAvg = (currentRating * numRatings + newRating) / (numRatings + 1);
        return newAvg;
    }
}