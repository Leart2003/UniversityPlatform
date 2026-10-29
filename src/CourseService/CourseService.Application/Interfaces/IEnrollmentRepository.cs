using CourseService.Domain.Entities;

namespace CourseService.Application.Interfaces;

public interface IEnrollmentRepository : IRepository<Enrollment>
{
    Task<List<Enrollment>> GetByCourseIdAsync(int courseId);
    Task<Enrollment?> GetByCourseAndStudentAsync(int courseId, int studentId);
}