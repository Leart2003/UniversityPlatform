using LoginService.Application.DTOs;
using LoginService.Application.Interfaces;
using LoginService.Domain.Entities;
using LoginService.Domain.Enums;

namespace LoginService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToDto).ToList();
    }

    public async Task<UserDto> RegisterAsync(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var existing = await _userRepository.GetByEmailAsync(email);
        if (existing != null)
            throw new InvalidOperationException("A user with this email already exists.");

        var user = new User
        {
            Email = email,
            PasswordHash = _passwordHasher.Hash(dto.Password),
            Role = UserRole.Student
        };

        await _userRepository.AddAsync(user);
        return MapToDto(user);
    }

    public async Task<UserDto?> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
            return null;

        return MapToDto(user);
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Role = user.Role.ToString()
    };
}
