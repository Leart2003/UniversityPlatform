using CourseService.Application.Interfaces;
using CourseService.Domain.Entities;
using CourseService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseService.Infrastructure.Repositories;

public class CourseRepository : Repository<Course>, ICourseRepository
{
    public CourseRepository(CourseDbContext context) : base(context) { }

    public async Task<Course?> GetByCodeAsync(string code)
        => await _dbSet.FirstOrDefaultAsync(course => course.Code == code);
}
