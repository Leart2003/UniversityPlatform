using Microsoft.EntityFrameworkCore;
using StudentService.Domain.Entites;


namespace StudentService.Infrastructure.Data;

public class StudentDbContext : DbContext
{
    public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>(entity =>
        {
            entity.Property(s => s.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(s => s.LastName).IsRequired().HasMaxLength(50);
            entity.Property(s => s.Email).IsRequired().HasMaxLength(100);
            entity.Property(s => s.StudentNumber).IsRequired().HasMaxLength(20);

            entity.HasIndex(s => s.Email).IsUnique();
            entity.HasIndex(s => s.StudentNumber).IsUnique();
        });
    }
}