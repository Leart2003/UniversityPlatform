using NotificationService.Application.DTOs;
using NotificationService.Application.Interfaces;
using NotificationService.Domain.Entities;

namespace NotificationService.Application.Services;

public class NotificationService(INotificationRepository repository) : INotificationService
{
    public async Task<NotificationDto?> GetByIdAsync(int id)
    {
        var notification = await repository.GetByIdAsync(id);
        return notification is null ? null : MapToDto(notification);
    }

    public async Task<List<NotificationDto>> GetAllAsync()
    {
        var notifications = await repository.GetAllAsync();
        return notifications.Select(MapToDto).ToList();
    }

    public async Task<List<NotificationDto>> GetByUserIdAsync(int userId)
    {
        var notifications = await repository.GetByUserIdAsync(userId);
        return notifications.Select(MapToDto).ToList();
    }

    public async Task<NotificationDto> CreateAsync(CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title.Trim(),
            Message = dto.Message.Trim()
        };

        await repository.AddAsync(notification);
        return MapToDto(notification);
    }

    private static NotificationDto MapToDto(Notification notification) => new()
    {
        Id = notification.Id,
        UserId = notification.UserId,
        Title = notification.Title,
        Message = notification.Message,
        CreatedAt = notification.CreatedAt,
        IsRead = notification.IsRead
    };
}
