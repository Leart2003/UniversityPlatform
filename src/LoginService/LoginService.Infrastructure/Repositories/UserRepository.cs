using LoginService.Application.Interfaces;
using LoginService.Domain.Entities;
using LoginService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LoginService.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(LoginDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
        => await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
}