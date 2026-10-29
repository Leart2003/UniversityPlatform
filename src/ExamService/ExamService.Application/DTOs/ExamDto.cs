namespace ExamService.Application.DTOs;

public class ExamDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public int MaxScore { get; set; }
}
