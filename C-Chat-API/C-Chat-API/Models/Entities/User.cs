using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace C_Chat_API.Models.Entities;

[Index(nameof(Name), nameof(Email), IsUnique = true)]
public class User
{
    public int UserId { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }

    [DefaultValue(UserRole.USER)]
    public UserRole Role { get; set; }

    // One to many User-UserChat
    public ICollection<UserChat> UsersChats { get; set; }
    // One to many User-Message
    public ICollection<Message> Messages { get; set; }

}
public enum UserRole
{
    USER,
    ADMIN
}
