using NotificationService.Application.DTOs;

namespace NotificationService.Application.Interfaces;

public interface INotificationService
{
    Task<NotificationDto?> GetByIdAsync(int id);
    Task<List<NotificationDto>> GetAllAsync();
    Task<List<NotificationDto>> GetByUserIdAsync(int userId);
    Task<NotificationDto> CreateAsync(CreateNotificationDto dto);
}
