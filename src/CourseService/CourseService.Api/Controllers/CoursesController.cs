using CourseService.Application.DTOs;
using CourseService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CourseService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CourseDto>>> GetAll()
    {
        var courses = await _courseService.GetAllAsync();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetById(int id)
    {
        var course = await _courseService.GetByIdAsync(id);
        if (course == null)
            return NotFound();

        return Ok(course);
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> Create(CreateCourseDto dto)
    {
        try
        {
            var course = await _courseService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = course.Id }, course);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CourseDto>> Update(int id, UpdateCourseDto dto)
    {
        try
        {
            var course = await _courseService.UpdateAsync(id, dto);
            if (course == null)
                return NotFound();

            return Ok(course);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _courseService.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/enrollments")]
    public async Task<ActionResult<EnrollmentDto>> Enroll(int id, EnrollStudentDto dto)
    {
        try
        {
            var enrollment = await _courseService.EnrollStudentAsync(id, dto.StudentId);
            return StatusCode(StatusCodes.Status201Created, enrollment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/enrollments")]
    public async Task<ActionResult<List<EnrollmentDto>>> GetEnrollments(int id)
    {
        try
        {
            var enrollments = await _courseService.GetEnrollmentsAsync(id);
            return Ok(enrollments);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}