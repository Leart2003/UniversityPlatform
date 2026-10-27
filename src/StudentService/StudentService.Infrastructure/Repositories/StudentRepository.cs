using Microsoft.EntityFrameworkCore;
using StudentService.Application;
using StudentService.Application.Interfaces;
using StudentService.Domain.Entities;
using StudentService.Infrastructure.Data;

namespace StudentService.Infrastructure.Repositories;

public class StudentRepository : Repository<Student>, IStudentRepository
{
    public StudentRepository(StudentDbContext context) : base(context) { }

    public async Task<Student?> GetByEmailAsync(string email)
        => await _dbSet.FirstOrDefaultAsync(s => s.Email == email);

    public async Task<Student?> GetByStudentNumberAsync(string studentNumber)
        => await _dbSet.FirstOrDefaultAsync(s => s.StudentNumber == studentNumber);
}