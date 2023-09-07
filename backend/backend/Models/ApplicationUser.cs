using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string ProjectId { get; set; } = string.Empty;
    }
}
