using System.ComponentModel.DataAnnotations;

namespace CourseService.Application.DTOs;

public class CreateCourseDto
{
    [Required, MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Range(1, 30)]
    public int Credits { get; set; }

    public int? ProfessorId { get; set; }
}