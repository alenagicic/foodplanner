using System.ComponentModel.DataAnnotations;

namespace Lifeplanner.Entity{



    public class SignInEntity{
        
        [Key]

        public int Id {get;set;}
        public string? Username {get;set;}
        public string? Password {get;set;}
        public string? PsuedoName {get;set;}

        
    
    }


}