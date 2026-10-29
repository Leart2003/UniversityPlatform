namespace CourseService.Domain.Entities;

public class Course : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Credits { get; set; }
    public int? ProfessorId { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}