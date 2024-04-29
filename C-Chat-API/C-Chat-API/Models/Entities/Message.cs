namespace C_Chat_API.Models.Entities
{
    public class Message
    {
        public int MessageId { get; set; }
        public DateTime Date { get; set; }
        public string Content { get; set; }

        // Foreign keys
        public User User { get; set; }
        public Chat Chat { get; set; }
    }
}
