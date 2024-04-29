using C_Chat_API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace C_Chat_API.Models
{
    public class ChatContext : DbContext
    {
        public const string DATABASE_PATH = "C_Chat.db";
        public DbSet<User> Users { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserChat> UserChats { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;

            optionsBuilder.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
        }
    }
}
