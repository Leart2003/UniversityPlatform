using Microsoft.AspNetCore.Mvc;
using NotificationService.Application.DTOs;
using NotificationService.Application.Interfaces;

namespace NotificationService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetAll()
        => Ok(await notificationService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NotificationDto>> GetById(int id)
    {
        var notification = await notificationService.GetByIdAsync(id);
        return notification is null ? NotFound() : Ok(notification);
    }

    [HttpGet("users/{userId:int}")]
    public async Task<ActionResult<List<NotificationDto>>> GetByUserId(int userId)
    {
        if (userId <= 0)
            return BadRequest(new { message = "User ID must be greater than zero." });

        return Ok(await notificationService.GetByUserIdAsync(userId));
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDto>> Create(CreateNotificationDto dto)
    {
        var notification = await notificationService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = notification.Id }, notification);
    }
}
