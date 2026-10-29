using ExamService.Application.DTOs;
using ExamService.Application.Interfaces;
using ExamService.Domain.Entities;

namespace ExamService.Application.Services;

public class ExamService : IExamService
{
    private readonly IExamRepository _repository;

    public ExamService(IExamRepository repository) => _repository = repository;

    public async Task<ExamDto?> GetByIdAsync(int id)
    {
        var exam = await _repository.GetByIdAsync(id);
        return exam is null ? null : MapToDto(exam);
    }

    public async Task<List<ExamDto>> GetAllAsync()
    {
        var exams = await _repository.GetAllAsync();
        return exams.Select(MapToDto).ToList();
    }

    public async Task<ExamDto> CreateAsync(CreateExamDto dto)
    {
        var title = dto.Title.Trim();
        if (await _repository.GetByCourseAndTitleAsync(dto.CourseId, title) is not null)
            throw new InvalidOperationException("An exam with this title already exists for this course.");

        var exam = new Exam
        {
            CourseId = dto.CourseId,
            Title = title,
            ScheduledAt = dto.ScheduledAt,
            MaxScore = dto.MaxScore
        };

        await _repository.AddAsync(exam);
        return MapToDto(exam);
    }

    private static ExamDto MapToDto(Exam exam) => new()
    {
        Id = exam.Id,
        CourseId = exam.CourseId,
        Title = exam.Title,
        ScheduledAt = exam.ScheduledAt,
        MaxScore = exam.MaxScore
    };
}
