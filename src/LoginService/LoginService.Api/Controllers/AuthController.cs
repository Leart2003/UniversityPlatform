using LoginService.Application.DTOs;
using LoginService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LoginService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        try
        {
            var user = await _authService.RegisterAsync(dto);
            return StatusCode(StatusCodes.Status201Created, user);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _authService.LoginAsync(dto);
        if (user == null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(user);
    }
}