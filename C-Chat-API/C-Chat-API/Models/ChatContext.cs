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
    }
}
