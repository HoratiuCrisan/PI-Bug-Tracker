namespace backend.Models
{
    public class ProjectId
    {
        public string pid { get; set; } = string.Empty;
        public List<string> members { get; set; } = new List<string>();
    }
}
