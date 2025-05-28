using Lifeplanner.Controllers;
using Lifeplanner.Factory;
using Lifeplanner.Middleware;
using Lifeplanner.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddTransient<CommunityServices>();
builder.Services.AddTransient<CommunityFactory>();
builder.Services.AddTransient<GeneratorServices>();
builder.Services.AddTransient<GeneratorMapper>();
builder.Services.AddTransient<AuthServices>();


builder.Services.AddHttpContextAccessor();


// Add DbContext to the dependency injection container
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

var app = builder.Build();

app.UseCors(policy =>
{
    policy.AllowAnyOrigin()  // Allows all origins
          .AllowAnyHeader()  // Allows all headers
          .AllowAnyMethod(); // Allows all methods (GET, POST, PUT, DELETE, etc.)
});


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseMiddleware<TokenValidationMiddleware>("my-secure-jwt-secret-key-super-long-keyyyyy");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
