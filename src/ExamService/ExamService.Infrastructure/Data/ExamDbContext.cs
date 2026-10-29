using ExamService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamService.Infrastructure.Data;

public class ExamDbContext(DbContextOptions<ExamDbContext> options) : DbContext(options)
{
    public DbSet<Exam> Exams => Set<Exam>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exam>(entity =>
        {
            entity.Property(exam => exam.Title).IsRequired().HasMaxLength(100);
            entity.HasIndex(exam => new { exam.CourseId, exam.Title }).IsUnique();
        });
    }
}
