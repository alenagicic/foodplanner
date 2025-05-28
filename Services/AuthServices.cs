using Lifeplanner.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Lifeplanner.Entity;
using Lifeplanner.Migrations;

namespace Lifeplanner.Services{

    public class AuthServices{

        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContext;
        public AuthServices(ApplicationDbContext Context, IHttpContextAccessor HttpContext){
            _context = Context;
            _httpContext = HttpContext;
        }
        public bool SignIn(SignInModel model){
            
            var Result = _context.SignInTable.Where(x => x.Username == model.Username).FirstOrDefault();
            
            if(Result != null){
                model.Username = Result!.Username;
                model.PsuedoName = Result!.PsuedoName;
            }
          

            if(Result != null && model.Password == Result!.Password){

                var token = GenerateJwtToken(model);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(1)
                };

                _httpContext.HttpContext!.Response.Cookies.Append("AuthToken", token, cookieOptions);
                
                return true;
            }

            return false;
        }
        public string GenerateJwtToken(SignInModel model)
        {

            if(model.PsuedoName == null){
                model.PsuedoName = "";
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my-secure-jwt-secret-key-super-long-keyyyyy"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, model.Username!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("psuedoname", model.PsuedoName!)
            };

            var token = new JwtSecurityToken(
                issuer: "Foodplanner",
                audience: "Foodplanner-user",
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public bool SignUp(SignInModel model){
            
            var checkUserExists = _context.SignInTable.Where(x => x.Username == model.Username).FirstOrDefault();

            if(checkUserExists != null){
                return false;
            }

            var Entity = new SignInEntity(){
                Password = model.Password,
                Username = model.Username
            };

            _context.SignInTable.Add(Entity);

            var Result = _context.SaveChanges();

            if(Result > 0){

                SignIn(model);

                return true;
            }

            return false;
        }
        public SignInModel GetUser(string username){

            var result = _context.SignInTable
                .Where(x => x.Username == username
                .ToLower()).FirstOrDefault();

            SignInModel model = new();

            if(result != null){
                model.Username = result!.Username;
                model.Password = result.Password;
                model.PsuedoName = result.PsuedoName;
            }

            return model;

        }
        public bool UpdateUser(SignInModel model){

            var Entity = _context.SignInTable
                .Where(x => x.Username == model.Username)
                .FirstOrDefault();

            if (!string.IsNullOrEmpty(model.Password))
            {
                Entity!.Password = model.Password;
            }

            if (!string.IsNullOrEmpty(model.PsuedoName))
            {
                Entity!.PsuedoName = model.PsuedoName;
            }

            var Result = _context.SignInTable.Update(Entity!);

            var ResultSet = _context.SaveChanges();

            if(ResultSet > 0){
                return true;
            }

            return false;
        }
        public bool CheckIfPsuedoExists(string psuedo){

            var resultGet = _context.SignInTable
                .Where(x => x.PsuedoName!.ToLower() == psuedo.ToLower())
                .FirstOrDefault();

            if(resultGet != null){
                return true;
            }

            return false;
        }

        public bool SignInTime(string username){
            
            LastSignedIn model = new(){
                DateTime = DateTime.Now.ToString("MM, dd, HH:mm"),
                Username = username,
            };

            _context.SignInTime.Add(model);
            _context.SaveChanges();

            return true;
        }
    }

}



