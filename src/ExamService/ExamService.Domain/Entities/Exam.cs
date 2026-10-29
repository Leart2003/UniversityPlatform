namespace ExamService.Domain.Entities;

public class Exam : BaseEntity
{
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public int MaxScore { get; set; } = 100;
}
