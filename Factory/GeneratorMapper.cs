


using Lifeplanner.Entity;
using Lifeplanner.Models;

namespace Lifeplanner.Factory{


    public class GeneratorMapper{

        public GeneratorModel MapEntityToModel(GeneratorEntity model){

            List<TagsModel> tags = new();

            if(model.TagsRecipe != null){
                foreach(var item in model.TagsRecipe!){

                        TagsModel tagsNew = new();

                        tagsNew.Id = item.Id;
                        tagsNew.Tag = item.Tag;

                        tags.Add(tagsNew);
                        
                }   

            }
          

            var result = new GeneratorModel(){
                BodyRecipe = model.BodyRecipe,
                Heading = model.Heading,
                Id = model.Id,
                ImageRecipe = model.ImageRecipe,
                RatingRecipe = model.RatingRecipe,
                TagsRecipe = tags,
                IngredientRecipe = model.IngredientRecipe,
                Author = model.Author,
                CreatedDate = model.CreatedDate,
                AmountRatings = model.AmountRatings,
                NumberDownloads = model.NumberDownloads,

            };

            return result;
        }

        public GeneratorEntity MapModelToEntity(GeneratorModel model){

            List<TagsEntity> tags = new();

            foreach(var item in model.TagsRecipe!){
                TagsEntity tagsNew = new();

                tagsNew.Id = item.Id;
                tagsNew.Tag = item.Tag;

                tags.Add(tagsNew);
            }

            var result = new GeneratorEntity(){
                BodyRecipe = model.BodyRecipe,
                Heading = model.Heading,
                Id = model.Id,
                ImageRecipe = model.ImageRecipe,
                RatingRecipe = model.RatingRecipe,
                TagsRecipe = tags,
                IngredientRecipe = model.IngredientRecipe,
                Author = model.Author,
                CreatedDate = model.CreatedDate,
                AmountRatings = model.AmountRatings,
                NumberDownloads = model.NumberDownloads,
            };

            return result;
        }








    }


}