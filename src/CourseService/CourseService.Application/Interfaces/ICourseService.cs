using CourseService.Application.DTOs;

namespace CourseService.Application.Interfaces;

public interface ICourseService
{
    Task<CourseDto?> GetByIdAsync(int id);
    Task<List<CourseDto>> GetAllAsync();
    Task<CourseDto> CreateAsync(CreateCourseDto dto);
    Task<CourseDto?> UpdateAsync(int id, UpdateCourseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<EnrollmentDto> EnrollStudentAsync(int courseId, int studentId);
    Task<List<EnrollmentDto>> GetEnrollmentsAsync(int courseId);
}