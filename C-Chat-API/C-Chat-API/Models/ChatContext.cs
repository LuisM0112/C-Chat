using C_Chat_API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace C_Chat_API.Models
{
    public class ChatContext : DbContext
    {
        public ChatContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserChat> UserChats { get; set; }

        public void Seed()
        {
            if (!Users.Any(u => u.Role == UserRole.ADMIN))
            {
                Users.Add(new User
                {
                    Name = "Admin",
                    Email = "Admin@email.es",
                    Password = "AdminPW",
                    Role = UserRole.ADMIN
                });
                SaveChanges();
            }
        }
    }
}
