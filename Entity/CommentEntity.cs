using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Lifeplanner.Entity;

namespace Lifeplanner.Entity
{
    public class CommentEntity
    {
        [Key]
        public int Id { get; set; }

        public string? Author { get; set; }

        public string? CommentBody { get; set; }

        public List<CommentEntity>? Reply { get; set; }

        // Important communityID means what topic
        public int CommunityId { get; set; }

        public CommunityEntity? Community { get; set; }

        // Important parentcommentid means what parent topic
        public int? ParentCommentId { get; set; }

        public CommentEntity? ParentComment { get; set; }

        public string? CommentTime {get;set;}
        
        public bool? CheckedByAuthor {get;set;}
    }
}
