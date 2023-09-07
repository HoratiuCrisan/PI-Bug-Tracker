using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos
{
    public class TicketDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Response { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public string Status { get; set; } = "Submitted";

        public bool IsActive { get; set; } = true;

        public string Submitter { get; set; } = string.Empty;

        public string Handler { get; set;} = string.Empty;

        public DateTime CreationDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime SolvedDate { get; set; }

    }
}
