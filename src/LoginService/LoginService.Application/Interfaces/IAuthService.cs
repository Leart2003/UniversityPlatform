using LoginService.Application.DTOs;

namespace LoginService.Application.Interfaces;

public interface IAuthService
{
    Task<UserDto?> GetByIdAsync(int id);
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto> RegisterAsync(RegisterDto dto);
    Task<UserDto?> LoginAsync(LoginDto dto);
}
