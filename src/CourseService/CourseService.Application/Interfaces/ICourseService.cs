using CourseService.Domain.Entities;

namespace CourseService.Application.Interfaces;

public interface ICourseRepository : IRepository<Course>
{
    Task<Course?> GetByCodeAsync(string code);
}