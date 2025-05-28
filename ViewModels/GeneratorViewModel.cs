using Lifeplanner.Models;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Lifeplanner.ViewModels{
    public class GeneratorViewModel{

        public List<GeneratorModel>? list {get;set;}
        public List<TagsModel>? listTags {get;set;}
        
    }
}