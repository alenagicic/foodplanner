namespace Lifeplanner.Models{
    public class CommunityModel{

        public int Id {get;set;}
        public string? Author {get;set;}
        public string? Topic {get;set;}
        public string? TopicBody {get;set;}
        public string? Category {get;set;} 
        public List<CommentModel>? Comments {get;set;}
        public string? CommentPost {get;set;}
        public string? Rating {get;set;}
        public int? ViewCount {get;set;}
    }
}