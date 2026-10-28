using LoginService.Application.DTOs;

namespace LoginService.Application.Interfaces;

public interface IAuthService
{
    Task<UserDto> RegisterAsync(RegisterDto dto);
    Task<UserDto?> LoginAsync(LoginDto dto);
}