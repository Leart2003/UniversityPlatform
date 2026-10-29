namespace CourseService.Domain.Entities;

public class Enrollment : BaseEntity
{
    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public int StudentId { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
}