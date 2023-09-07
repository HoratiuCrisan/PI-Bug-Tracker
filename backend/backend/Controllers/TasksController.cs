using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.OtherObjects;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TasksController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("Create-Task/{id}")]
        public async Task<IActionResult> CreateTasks(int id,[FromBody] TasksDto tasksDto)
        {
            var newTask = new Tasks();

            newTask.Title = tasksDto.Title;
            newTask.Description = tasksDto.Description;
            newTask.Status = tasksDto.Status;
            newTask.Priority = tasksDto.Priority;
            newTask.ProjectId = id;
            newTask.CreationDate = tasksDto.CreationDate;
            newTask.Deadline = tasksDto.Deadline;

            await _context.Tasks.AddAsync(newTask);
            await _context.SaveChangesAsync();
            return Ok("Task created successfuly");
        }

        [HttpGet]
        [Route("Get-Tasks/{id}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTaks(int id)
        {
            // Get Tickets from Context

            var tasks = await _context.Tasks
                .Where(task => (task.ProjectId == id))
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpGet]
        [Route("Edit-Task/{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public ActionResult<Tasks> GetTasksById(int id)
        {
            var tasks = _context.Tasks.FirstOrDefault(task => task.Id == id);

            if (tasks == null)
                return NotFound();

            return Ok(tasks);
        }

        [HttpDelete]
        [Route("Delete-Task/{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public ActionResult<Tasks> DeleteTask(int id)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);

            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return Ok("Ticket deleted successfully!");
        }

        [HttpGet]
        [Route("Answer-Task/{id}")]
        public ActionResult<Tasks> AnswerTaskById(int id)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);

            if (task == null)
                return NotFound();

            return task;
        }

        [HttpPut]
        [Route("Discard-Task-Changes/{id}")]
        public ActionResult<Tasks> DiscardTaskChanges(int id, [FromBody] TasksDto tasksDto)
        {
            var task = _context.Tasks.FirstOrDefault(T => T.Id == id);

            if (task == null)
                return NotFound();

            /* Update description, handler, status, isActive
             * because when you discard changes, all the modifications
             * reset 
             */

            if (tasksDto.Response != null)
                task.Response = tasksDto.Response;

            if (!string.IsNullOrEmpty(tasksDto.Status))
                task.Status = tasksDto.Status;

            _context.SaveChanges();

            return Ok("Task data updated!");
        }

        [HttpPut]
        [Route("Complete-Task/{id}")]
        public ActionResult<Tasks> CompleteTicket(int id, [FromBody] TasksDto tasksDto)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);

            if (task == null)
                return NotFound();

            /* Set ticket response,
             * Ticket handler, as the person that completed the ticket
             * Status will be set to archived
             * Add a completion date
             * And the active field will be set to flase since the ticket
             * is completed
             */
            if (!string.IsNullOrEmpty(tasksDto.Title))
                task.Title = tasksDto.Title;

            if (!string.IsNullOrEmpty(tasksDto.Description))
                task.Description = tasksDto.Description;

            if (!string.IsNullOrEmpty(tasksDto.Response))
                task.Response = tasksDto.Response;

            if (!string.IsNullOrEmpty(tasksDto.Status))
                task.Status = tasksDto.Status;

            if (!string.IsNullOrEmpty(tasksDto.Priority))
                task.Priority = tasksDto.Priority;

            task.Handler = tasksDto.Handler;
            task.Deadline = tasksDto.Deadline;
            task.SolvedDate = tasksDto.SolvedDate;

            _context.SaveChanges();

            return Ok("Ticket completion done successfully!");
        }
    }

    
}
