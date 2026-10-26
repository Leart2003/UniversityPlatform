using StudentService.Domain.Entites;
using System;
using System.Collections.Generic;
using System.Text;

namespace StudentService.Application
{
    public interface IStudentRepository : IRepository<Student>
    {
        Task<Student?> GetByEmailAsync(string email);
        Task<Student?> GetByStudentNumberAsync(string studentNumber);
    }
}
