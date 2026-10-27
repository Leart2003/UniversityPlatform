using StudentService.Application.DTOs;

namespace StudentService.Application.Interfaces;

public interface IStudentService
{
    Task<StudentDto?> GetByIdAsync(int id);
    Task<List<StudentDto>> GetAllAsync();
    Task<StudentDto> CreateAsync(CreateStudentDto dto);
}