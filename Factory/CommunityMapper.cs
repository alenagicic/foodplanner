using Lifeplanner.Entity;
using Lifeplanner.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Lifeplanner.Factory
{
    public class CommunityFactory
    {

        public CommunityEntity MapCommunityModelToEntity(CommunityModel model)
        {

            try{
                    List<CommentEntity> entityList = new();

                foreach(var item in model.Comments!){
                    
                    CommentEntity comment = new(){
                        Author = item.Author,
                        CommentBody = item.CommentBody,
                        Id = item.Id
                    };

                    entityList.Add(comment);
                };

                CommunityEntity entity = new(){
                    Author = model.Author,
                    CommentPost = model.CommentPost,
                    Comments = entityList,
                    Id = model.Id,
                    Rating = model.Rating,
                    Topic = model.Topic,
                    TopicBody = model.TopicBody,
                    ViewCount = model.ViewCount,
                    Category = model.Category

                };

                return entity;

            }catch {
                return new CommunityEntity();
            }
         
        }



        public List<CommentModel> TraverseComments(List<CommentEntity> list){
            
            List<CommentModel> listComments = new();

            foreach(var item in list){

                CommentModel mapModel = new(){
                    Author = item.Author,
                    CommentBody = item.CommentBody,
                    Id = item.Id,
                };

                if(item.Reply != null){
                    mapModel.Reply = TraverseComments(item.Reply);
                }

                listComments.Add(mapModel);

            }
            
            return listComments;
        }

        public CommunityModel MapEntityToCommunityModel(CommunityEntity model)
        {
       
            List<CommentModel> modelList = new();

            if(model.Comments != null){
                modelList = TraverseComments(model.Comments);
            }
          
            CommunityModel finishedModel = new()
            {
                Author = model.Author,
                CommentPost = model.CommentPost,
                Comments = modelList,
                Id = model.Id,
                Rating = model.Rating,
                Topic = model.Topic,
                TopicBody = model.TopicBody,
                ViewCount = model.ViewCount,
                Category = model.Category
            };

            return finishedModel;
        }

        
       
    }
}
