namespace CourseService.Application.DTOs;

public class EnrollmentDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int StudentId { get; set; }
    public DateTime EnrolledAt { get; set; }
}