using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Lifeplanner.Middleware{

    public class TokenValidationMiddleware
    {
    private readonly RequestDelegate _next;
    private readonly string _secretKey;

    public TokenValidationMiddleware(RequestDelegate next, string secretKey)
    {
        _next = next;
        _secretKey = secretKey;
    }

    public async Task InvokeAsync(HttpContext context)
    {

        var token = context.Request.Cookies["AuthToken"];

        if (string.IsNullOrEmpty(token))
        {
            await _next(context);
            return;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            var jwtToken = validatedToken as JwtSecurityToken;

            var userEmail = jwtToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var userUsername = jwtToken?.Claims.FirstOrDefault(c => c.Type == "psuedoname")?.Value;

            context.Items["User"] = validatedToken;
            context.Items["Username"] = userEmail;
            context.Items["psuedoname"] = userUsername;

        }
        catch
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Invalid or expired token.");
            return;
        }

        await _next(context);
        }
    }



}