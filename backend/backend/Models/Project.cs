using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(10)]
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string ProjectManager { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime FinishDate { get; set; }
    }
}
