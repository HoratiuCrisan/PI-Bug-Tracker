using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(10)]
        public string Description { get; set; } = string.Empty;

        [MinLength(10)]
        public string Response { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string Priority { get; set; } = string.Empty;

        public string Status { get; set; } = "Submitted";

        public bool IsActive { get; set; } = true;

        [Required]
        public string Submitter { get; set; } = string.Empty;

        public string Handler { get; set; } = string.Empty;

        public DateTime CreationDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime SolvedDate { get; set; }
    }
}
