using C_Chat_API.Models.Entities;

namespace C_Chat_API.Models.Dto
{
    public class ChatDto
    {
        public int ChatId { get; set; }
        public string Name { get; set; }
        public string CreationDate { get; set; }

        public static ChatDto ToDto(Chat chat)
        {
            return new ChatDto
            { 
                ChatId = chat.ChatId,
                Name = chat.Name,
                CreationDate = chat.CreationDate.ToString("dddd dd MMMM yyyy HH:mm zzz")
            };
        }
    }
}
