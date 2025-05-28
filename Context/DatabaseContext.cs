using Microsoft.EntityFrameworkCore;
using Lifeplanner.Entity;


public class ApplicationDbContext : DbContext
{


    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
    {
    }
    
    public DbSet<CommunityEntity> CommunityTable {get;set;}
    public DbSet<CommentEntity> CommentTable {get;set;}
    public DbSet<GeneratorEntity> GeneratorTable {get;set;}
    public DbSet<TagsEntity> TagTable {get;set;}
    public DbSet<SignInEntity> SignInTable {get;set;}
    public DbSet<LastSignedIn> SignInTime {get;set;}

     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CommentEntity>()
            .HasOne(c => c.ParentComment)         
            .WithMany(c => c.Reply)              
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);  

        modelBuilder.Entity<CommentEntity>()
            .HasMany(c => c.Reply)
            .WithOne(c => c.ParentComment)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Cascade);
    }


}