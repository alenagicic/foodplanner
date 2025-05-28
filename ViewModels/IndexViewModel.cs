using Lifeplanner.Models;

namespace Lifeplanner.ViewModels{

    public class IndexViewModel{
        
        public string? Email {get;set;}
        public string? Username {get;set;}
        public string? Password {get;set;}
        public List<GeneratorModel>? ListGen {get;set;}
        public List<CommunityModel>? ListCommunity {get;set;}
    }

}