using System.ComponentModel.DataAnnotations;

namespace ExamService.Application.DTOs;

public class CreateExamDto
{
    [Range(1, int.MaxValue)]
    public int CourseId { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    public DateTime ScheduledAt { get; set; }

    [Range(1, int.MaxValue)]
    public int MaxScore { get; set; } = 100;
}
