using NotificationService.Domain.Entities;

namespace NotificationService.Application.Interfaces;

public interface INotificationRepository : IRepository<Notification>
{
    Task<List<Notification>> GetByUserIdAsync(int userId);
}
