using CourseService.Application.Interfaces;
using CourseService.Domain.Entities;
using CourseService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CourseService.Infrastructure.Repositories;

public class EnrollmentRepository : Repository<Enrollment>, IEnrollmentRepository
{
    public EnrollmentRepository(CourseDbContext context) : base(context) { }

    public async Task<List<Enrollment>> GetByCourseIdAsync(int courseId)
        => await _dbSet.Where(enrollment => enrollment.CourseId == courseId).ToListAsync();

    public async Task<Enrollment?> GetByCourseAndStudentAsync(int courseId, int studentId)
        => await _dbSet.FirstOrDefaultAsync(enrollment =>
            enrollment.CourseId == courseId && enrollment.StudentId == studentId);
}
