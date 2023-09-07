using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("Get-Users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = _context.Users.ToList();
            var usersWithRoles = new List<object>();

            foreach (var user in users)
            {
                
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new
                {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        PID = user.ProjectId,
                        Roles = roles[0],
                        SubmittedTickets = _context.Ticket
                       .Where(ticket => ticket.Handler == user.Email)
                       .ToList().Count()
                    });
                }
            

            return Ok(usersWithRoles);
        }
    }
}
