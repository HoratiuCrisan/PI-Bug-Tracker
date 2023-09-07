using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Tasks
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Handler { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime Deadline { get; set;}
        public DateTime SolvedDate { get; set; }
    }
}
