using System.ComponentModel.DataAnnotations;

namespace C_Chat_API.Models.Entities;

public class Chat
{
    public int ChatId { get; set; }

    [Required]
    public string Name { get; set; }
    public DateTime CreationDate { get; set; }

    // One to many Chat-UserChat
    public ICollection<UserChat> UsersChats { get; set; }
    // One to many Chat-Message
    public ICollection<Message> Messages { get; set; }
}
