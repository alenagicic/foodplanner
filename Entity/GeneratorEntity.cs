
using System.ComponentModel.DataAnnotations;

namespace Lifeplanner.Entity;

public class GeneratorEntity{

    [Key]
    public int Id {get;set;}
    public string? Heading {get;set;}
    public string? BodyRecipe {get;set;}

    // Ratings
    public double? RatingRecipe {get;set;}
    public int? NumberDownloads {get;set;}
    public int? AmountRatings {get;set;}

    // End Ratings

    public string? IngredientRecipe {get;set;}
    public List<TagsEntity>? TagsRecipe {get;set;}
    public string? ImageRecipe {get;set;}
    public string? Author {get;set;}
    public string? CreatedDate {get;set;}

}