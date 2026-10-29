using ExamService.Domain.Entities;

namespace ExamService.Application.Interfaces;

public interface IExamRepository : IRepository<Exam>
{
    Task<Exam?> GetByCourseAndTitleAsync(int courseId, string title);
}
