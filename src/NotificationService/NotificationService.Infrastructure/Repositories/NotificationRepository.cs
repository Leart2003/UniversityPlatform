using Microsoft.EntityFrameworkCore;
using NotificationService.Application.Interfaces;
using NotificationService.Domain.Entities;
using NotificationService.Infrastructure.Data;

namespace NotificationService.Infrastructure.Repositories;

public class NotificationRepository(NotificationDbContext context)
    : Repository<Notification>(context), INotificationRepository
{
    public async Task<List<Notification>> GetByUserIdAsync(int userId)
        => await _dbSet.Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.CreatedAt)
            .ToListAsync();
}
