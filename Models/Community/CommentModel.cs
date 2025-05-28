namespace Lifeplanner.Models{
    public class CommentModel{

        public int Id { get; set; }

        public string? Author { get; set; }

        public string? CommentBody { get; set; }

        public List<CommentModel>? Reply { get; set; }

        public string? CommentTime {get;set;}
        
        public bool? CheckedByAuthor {get;set;}

        public int? TopicId {get;set;}

    }
}