using ExamService.Application.DTOs;

namespace ExamService.Application.Interfaces;

public interface IExamService
{
    Task<ExamDto?> GetByIdAsync(int id);
    Task<List<ExamDto>> GetAllAsync();
    Task<ExamDto> CreateAsync(CreateExamDto dto);
}
