using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string ProjectId { get; set; } = string.Empty;
    }
}
