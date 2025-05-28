
using Lifeplanner.Entity;

namespace Lifeplanner.Models;

public class GeneratorModel{

    public int Id {get;set;}
    public string? Heading {get;set;}
    public string? BodyRecipe {get;set;}
    public string? IngredientRecipe {get;set;}

    // Ratings
    public double? RatingRecipe {get;set;}
    public int? NumberDownloads {get;set;}
    public int? AmountRatings {get;set;}
    // End Ratings
    
    public List<TagsModel>? TagsRecipe {get;set;}
    public string? ImageRecipe {get;set;}
    public string? Author {get;set;}
    public string? CreatedDate {get;set;}

}