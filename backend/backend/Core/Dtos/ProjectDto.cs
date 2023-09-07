using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos
{
    public class ProjectDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string ProjectManager { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime FinishDate { get; set; }
    }
}
