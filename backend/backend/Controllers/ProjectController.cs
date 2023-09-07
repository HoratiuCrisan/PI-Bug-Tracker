using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.OtherObjects;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProjectController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("Create-Project")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
        {
            var newProject = new Project();

            newProject.Title = projectDto.Title;
            newProject.Description = projectDto.Description;
            newProject.Status = projectDto.Status;
            newProject.Priority = projectDto.Priority;
            newProject.ProjectManager = projectDto.ProjectManager;
            newProject.CreationDate = projectDto.CreationDate;
            newProject.Deadline = projectDto.Deadline;
            newProject.FinishDate = projectDto.FinishDate;

            await _context.Project.AddAsync(newProject);
            await _context.SaveChangesAsync();

            return Ok(projectDto);
        }

        //Append each project title to the selected users
        [HttpPut]
        [Route("Add-User-Id")]
        public async Task<IActionResult> Add_User_Id([FromBody] ProjectId projectId)
        {
            foreach (string member in projectId.members)
            {
                var user = await _userManager.FindByEmailAsync(member);

                if (user == null)
                    return BadRequest($"User {member} does not exist");

                if (user.ProjectId == null)
                    user.ProjectId = projectId.pid + ",";

                else
                    user.ProjectId += projectId.pid + ",";
            }

            await _context.SaveChangesAsync();
            return Ok("Users PID added successfuly!");
        }

        [HttpPut]
        [Route("Remove-ProjectId/{title}")]
        public async Task<IActionResult> Remove_PID(string title)
        {
            var users = await _context.Users.ToListAsync();

            if (users == null)
                return NotFound();

            foreach (var user in users)
            {
                string[] _pids = user.ProjectId.Split(',');

                bool containsPID = Array.Exists(_pids, pid => pid == title);

                if (containsPID)
                {
                   string[] newPid = RemovePIDFromArray(_pids, title);

                    string result = string.Join(",", newPid);

                    user.ProjectId = result;
                }
            }

            await _context.SaveChangesAsync();
            return Ok("PID removed successfuly!");
        }

        static string[] RemovePIDFromArray(string[] array, string wordToRemove)
        {
            //Remove word from the list
            var list = new System.Collections.Generic.List<string>(array);
            list.Remove(wordToRemove);
            return list.ToArray();
        }

        [HttpGet]
        [Route("Get-Projects")]
        public async Task<ActionResult<IEnumerable<Project>>>GetProjects()
        {
            var projects = await _context.Project
                .Where(project => (!project.Status.ToLower().Equals("archived")))
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet]
        [Route("Get-Archived-Projects")]
        public async Task<ActionResult<IEnumerable<Project>>>GetArchivedProjects()
        {
            var projects = await _context.Project
                .Where(project => (project.Status.ToLower().Equals("archived")))
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet]
        [Route("Get-My-Project/{email}")]
        public async Task<ActionResult>GetMyProjects(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User does not exist");

            string[] _pids = user.ProjectId.Split(',');

            List<Project> _myProjects = await _context.Project
                .Where(project => _pids.Contains(project.Title))
                .ToListAsync();

            return Ok(_myProjects);
        }

        [HttpDelete]
        [Route("Delete-Project/{id}")]
        public ActionResult<Project> DeleteProject(int id)
        {
            var project = _context.Project.FirstOrDefault(p => p.Id == id);

            if (project == null)
                return NotFound();

            _context.Project.Remove(project);
            _context.SaveChanges();

            return Ok($"Project no. {id} has been deleted!");
        }

        [HttpGet]
        [Route("Answer-Project/{id}")]
        public async Task<ActionResult<Project>> GetMyProject(int id)
        {
            var project = await _context.Project.FindAsync(id);

            if (project == null)
                return NotFound();

            //Get the users that are part of the project

            var _users = await _context.Users.ToListAsync();

            List<object> _users_list = new List<object>();

            foreach (var _user in _users)
            {
                var roles = await _userManager.GetRolesAsync(_user);
                string[] _pids = _user.ProjectId.Split(",");

                bool containsPID = Array.Exists(_pids, pid => pid == project.Title);

                if (containsPID)
                {
                    
                    _users_list.Add(new
                    {
                        Id = _user.Id,
                        Email = _user.Email,
                        UserName = _user.UserName,
                        Roles = roles[0],
                        SubmittedTickets = _context.Ticket
                       .Where(ticket => ticket.Handler == _user.Email)
                       .ToList().Count()
                    });
                }
            }

            var _newProject = new
            {
                Project = project,
                Users = _users_list
            };

            return Ok(_newProject);
        }

        [HttpPut]
        [Route("Complete-Project/{id}")]
        public ActionResult<Project> CompleteProject(int id)
        {
            var project = _context.Project.FirstOrDefault(p => p.Id == id);

            if (project == null )
                return NotFound();

            project.Status = "Completed";
            project.FinishDate = DateTime.Now;

            _context.Project.Add(project);
            _context.SaveChanges();

            return Ok("Project has been completed");
        }

        [HttpPut]
        [Route("Archive-Project/{id}")]
        public ActionResult<Project> ArchiveProject(int id)
        {
            var project = _context.Project.FirstOrDefault(p => p.Id == id);

            if (project == null)
                return NotFound();

            project.Status = "Archived";

            _context.Project.Add(project);
            _context.SaveChanges();

            return Ok("Project has been completed");
        }
    }
}

