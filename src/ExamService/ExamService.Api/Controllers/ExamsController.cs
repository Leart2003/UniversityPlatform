using ExamService.Application.DTOs;
using ExamService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController(IExamService examService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ExamDto>>> GetAll()
        => Ok(await examService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExamDto>> GetById(int id)
    {
        var exam = await examService.GetByIdAsync(id);
        return exam is null ? NotFound() : Ok(exam);
    }

    [HttpPost]
    public async Task<ActionResult<ExamDto>> Create(CreateExamDto dto)
    {
        try
        {
            var exam = await examService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = exam.Id }, exam);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
