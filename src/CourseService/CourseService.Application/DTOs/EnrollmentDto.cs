using System.ComponentModel.DataAnnotations;

namespace CourseService.Application.DTOs;

public class EnrollStudentDto
{
    [Range(1, int.MaxValue)]
    public int StudentId { get; set; }
}