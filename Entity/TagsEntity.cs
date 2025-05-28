using System.ComponentModel.DataAnnotations;

namespace Lifeplanner.Entity{




    public class TagsEntity{

        [Key]

        public int Id {get;set;}
        public string? Tag {get;set;}
        public GeneratorEntity? Generator {get;set;}
        public int GeneratorId {get;set;}

    }
}