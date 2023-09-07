using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos
{
    public class UpdatePermisionDto
    {
        [Required(ErrorMessage = ("Email is required"))]
        public string Email { get; set; } = string.Empty;

    }
}
