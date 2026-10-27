using StudentService.Application.DTOs;
using StudentService.Application.Interfaces;
using StudentService.Domain.Entites;
using StudentService.Domain.Entities;

namespace StudentService.Application.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _repository;

    public StudentService(IStudentRepository repository)
    {
        _repository = repository;
    }

    public async Task<StudentDto?> GetByIdAsync(int id)
    {
        var student = await _repository.GetByIdAsync(id);
        return student == null ? null : MapToDto(student);
    }

    public async Task<List<StudentDto>> GetAllAsync()
    {
        var students = await _repository.GetAllAsync();
        return students.Select(MapToDto).ToList();
    }

    public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
    {
        var existing = await _repository.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new InvalidOperationException("A student with this email already exists.");

        var student = new Student
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            StudentNumber = dto.StudentNumber
        };

        await _repository.AddAsync(student);
        return MapToDto(student);
    }

    private static StudentDto MapToDto(Student student) => new()
    {
        Id = student.Id,
        FirstName = student.FirstName,
        LastName = student.LastName,
        Email = student.Email,
        StudentNumber = student.StudentNumber
    };
}