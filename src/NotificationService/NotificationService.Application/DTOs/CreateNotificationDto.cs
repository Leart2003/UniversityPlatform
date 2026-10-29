using System.ComponentModel.DataAnnotations;

namespace NotificationService.Application.DTOs;

public class CreateNotificationDto
{
    [Range(1, int.MaxValue)]
    public int UserId { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}
