using CourseService.Application.DTOs;
using CourseService.Application.Interfaces;
using CourseService.Domain.Entities;

namespace CourseService.Application.Services;

public class CourseManager : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;

    public CourseManager(
        ICourseRepository courseRepository,
        IEnrollmentRepository enrollmentRepository)
    {
        _courseRepository = courseRepository;
        _enrollmentRepository = enrollmentRepository;
    }

    public async Task<CourseDto?> GetByIdAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        return course == null ? null : MapToDto(course);
    }

    public async Task<List<CourseDto>> GetAllAsync()
    {
        var courses = await _courseRepository.GetAllAsync();
        return courses.Select(MapToDto).ToList();
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto)
    {
        var existing = await _courseRepository.GetByCodeAsync(dto.Code);
        if (existing != null)
            throw new InvalidOperationException("A course with this code already exists.");

        var course = new Course
        {
            Code = dto.Code,
            Title = dto.Title,
            Description = dto.Description,
            Credits = dto.Credits,
            ProfessorId = dto.ProfessorId
        };

        await _courseRepository.AddAsync(course);
        return MapToDto(course);
    }

    public async Task<CourseDto?> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null)
            return null;

        var sameCode = await _courseRepository.GetByCodeAsync(dto.Code);
        if (sameCode != null && sameCode.Id != id)
            throw new InvalidOperationException("A course with this code already exists.");

        course.Code = dto.Code;
        course.Title = dto.Title;
        course.Description = dto.Description;
        course.Credits = dto.Credits;
        course.ProfessorId = dto.ProfessorId;

        await _courseRepository.UpdateAsync(course);
        return MapToDto(course);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null)
            return false;

        await _courseRepository.DeleteAsync(course);
        return true;
    }

    public async Task<EnrollmentDto> EnrollStudentAsync(int courseId, int studentId)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
            throw new KeyNotFoundException("Course not found.");

        var existing = await _enrollmentRepository.GetByCourseAndStudentAsync(courseId, studentId);
        if (existing != null)
            throw new InvalidOperationException("Student is already enrolled in this course.");

        var enrollment = new Enrollment
        {
            CourseId = courseId,
            StudentId = studentId
        };

        await _enrollmentRepository.AddAsync(enrollment);
        return MapToDto(enrollment);
    }

    public async Task<List<EnrollmentDto>> GetEnrollmentsAsync(int courseId)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
            throw new KeyNotFoundException("Course not found.");

        var enrollments = await _enrollmentRepository.GetByCourseIdAsync(courseId);
        return enrollments.Select(MapToDto).ToList();
    }

    private static CourseDto MapToDto(Course course) => new()
    {
        Id = course.Id,
        Code = course.Code,
        Title = course.Title,
        Description = course.Description,
        Credits = course.Credits,
        ProfessorId = course.ProfessorId
    };

    private static EnrollmentDto MapToDto(Enrollment enrollment) => new()
    {
        Id = enrollment.Id,
        CourseId = enrollment.CourseId,
        StudentId = enrollment.StudentId,
        EnrolledAt = enrollment.EnrolledAt
    };
}