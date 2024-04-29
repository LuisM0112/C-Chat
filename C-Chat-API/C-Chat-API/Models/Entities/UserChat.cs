namespace C_Chat_API.Models.Entities
{
    public class UserChat
    {
        public int UserChatId { get; set; }

        // Foreign keys
        public User User { get; set; }
        public Chat Chat { get; set; }
    }
}
