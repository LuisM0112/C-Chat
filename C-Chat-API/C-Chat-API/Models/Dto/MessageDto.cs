using C_Chat_API.Models.Entities;

namespace C_Chat_API.Models.Dto
{
    public class MessageDto
    {
        public string Author { get; set; }
        public string Chat { get; set; }
        public string Date { get; set; }
        public string Content { get; set; }

        public static MessageDto ToDto(Message message)
        {
            return new MessageDto
            {
                Author = message.User.Name,
                Chat = message.Chat.Name,
                Content = message.Content,
                Date = message.Date.ToString("dddd dd MMMM yyyy HH:mm zzz")
            };
        }
    }
}
