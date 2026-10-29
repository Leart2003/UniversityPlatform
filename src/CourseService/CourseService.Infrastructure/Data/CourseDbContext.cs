using CourseService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseService.Infrastructure.Data;

public class CourseDbContext : DbContext
{
    public CourseDbContext(DbContextOptions<CourseDbContext> options) : base(options) { }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.Property(c => c.Code).IsRequired().HasMaxLength(20);
            entity.Property(c => c.Title).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(500);

            entity.HasIndex(c => c.Code).IsUnique();
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Enrollments)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.CourseId, e.StudentId }).IsUnique();
        });
    }
}