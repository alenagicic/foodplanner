using System.ComponentModel.DataAnnotations;
using Lifeplanner.Entity;

namespace Lifeplanner.Entity{
    public class ReplyEntity{

        [Key]
        public int Id {get;set;}
        public string? Author {get;set;}
        public string? CommentBody {get;set;}
        public int CommentId { get; set; }
        public CommentEntity? Community { get; set; }
        public ReplyEntity? ParentReply { get; set; }
        public List<ReplyEntity>? Replies { get; set; }

    }
}