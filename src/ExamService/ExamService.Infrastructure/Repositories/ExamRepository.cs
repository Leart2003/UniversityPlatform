using ExamService.Application.Interfaces;
using ExamService.Domain.Entities;
using ExamService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamService.Infrastructure.Repositories;

public class ExamRepository(ExamDbContext context) : Repository<Exam>(context), IExamRepository
{
    public async Task<Exam?> GetByCourseAndTitleAsync(int courseId, string title)
        => await _dbSet.FirstOrDefaultAsync(exam => exam.CourseId == courseId && exam.Title == title);
}
