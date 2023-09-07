using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.OtherObjects;
using backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        // Route for seedint my roles to Data Base

        [HttpPost]
        [Route("seed-roles")]
        public async Task<IActionResult> SeedRoles()
        {
            bool adminExists = await _roleManager.RoleExistsAsync(StaticUserRoles.ADMIN);
            bool projectManagerExists = await _roleManager.RoleExistsAsync(StaticUserRoles.PROJECTMANAGER);
            bool developerExists = await _roleManager.RoleExistsAsync(StaticUserRoles.DEVELOPER);

            if (adminExists && projectManagerExists && developerExists)
                return Ok("Role seeding alerady exists!");

            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.DEVELOPER));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.PROJECTMANAGER));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.ADMIN));

            return Ok("Role seeding done succesfully!");
        }

        // Register user
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var userExists = await _userManager.FindByEmailAsync(registerDto.Email);

            if (userExists != null)
                return BadRequest("Email already exists!");

            ApplicationUser newUser = new()
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!createUserResult.Succeeded)
            {
                var errorString = "User creation failed!\n";
                foreach (var error in createUserResult.Errors)
                    errorString += error.Description;
                return BadRequest(errorString);
            }

            //Add a default user role for all users
            await _userManager.AddToRoleAsync(newUser, StaticUserRoles.DEVELOPER);

            return Ok("User created successfully!");
        }

        // Route -> Login
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user is null)
                return Unauthorized("Invalid credentials");

            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!isPasswordCorrect)
                return Unauthorized("Invalid credentials");

            var userRoles = await _userManager.GetRolesAsync(user);

            string _userName = user.UserName ?? "default";

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, _userName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, loginDto.Email),
                new Claim("JWTID", Guid.NewGuid().ToString())
            };

            //Add a new claim for each role in the data base
            foreach (var userRole in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));

            var token = GenerateNewJsonWebToken(authClaims);

            return Ok(token);
        }



         
        private string GenerateNewJsonWebToken(List<Claim> authClaims)
        {

            //Check for the value of the JWT secret
            var _configurationJWTValueCheck = _configuration["JWT:Secret"]?? "";

            SymmetricSecurityKey authSecret = new(Encoding.UTF8.GetBytes(_configurationJWTValueCheck));

            var tokenObject = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256)
                    ); 

            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);

            return token;
        }

        //Forgot Password
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
                return BadRequest("User not found!");

           
            return Ok("");
        }

        // Route to make user Project Manager
        [HttpPut]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        [Route("Make-Project-Manager")]
        public async Task<IActionResult> MakeProjectManager([FromBody] UpdatePermisionDto updatePermisionDto)
        {
            var user = await _userManager.FindByEmailAsync(updatePermisionDto.Email);

            if (user is null)
                return BadRequest("Invalid email!");

            await _userManager.AddToRoleAsync(user, StaticUserRoles.PROJECTMANAGER);
            

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.DEVELOPER))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.DEVELOPER);

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.ADMIN))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.ADMIN);

            return Ok($"{user.UserName} is now a Project Manager");

        }

        // Make user Admin
        [HttpPut]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        [Route("Make-Admin")]
        
        public async Task<IActionResult> MakeAdmin([FromBody] UpdatePermisionDto updatePermisionDto)
        {
            var user = await _userManager.FindByEmailAsync(updatePermisionDto.Email);

            if (user is null)
                return BadRequest("Invalid email!");

            await _userManager.AddToRoleAsync(user, StaticUserRoles.ADMIN);

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.DEVELOPER))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.DEVELOPER);

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.PROJECTMANAGER))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.PROJECTMANAGER);


            return Ok($"{user.UserName} is now Admin");
        }

        //Make user a developer
        [HttpPut]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        [Route("Make-Developer")]

        public async Task<IActionResult> MakeUser([FromBody] UpdatePermisionDto updatePermisionDto)
        {
            var user = await _userManager.FindByEmailAsync(updatePermisionDto.Email);

            if (user is null)
                return BadRequest("Invalid email!");

            await _userManager.AddToRoleAsync(user, StaticUserRoles.DEVELOPER);

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.ADMIN))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.ADMIN);

            if (await _userManager.IsInRoleAsync(user, StaticUserRoles.PROJECTMANAGER))
                await _userManager.RemoveFromRoleAsync(user, StaticUserRoles.PROJECTMANAGER);

            return Ok($"{user.UserName} is now a Developer");
        }
        
    }
}
