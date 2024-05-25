using C_Chat_API.Models;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Text;

namespace C_Chat_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebSocketController : ControllerBase
    {
        private static ConcurrentDictionary<string, ConcurrentDictionary<int, WebSocket>> _chatSockets = new ConcurrentDictionary<string, ConcurrentDictionary<int, WebSocket>>();
        private readonly ChatContext _dbContext;
        private readonly IConfiguration _configuration;

        public WebSocketController(ChatContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [Route("/ws")]
        [HttpGet]
        public async Task Get(string chatId, string jwt)
        {
            int id = await ReadJwt(jwt);
            if (HttpContext.WebSockets.IsWebSocketRequest && id != 0)
            {
                WebSocket? webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                Console.WriteLine($"Conexíon establecida por un cliente con id: {id}, al chat con id: {chatId}");
                await ConnectWebSocket(id, chatId, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        private async Task ConnectWebSocket(int userId, string chatId, WebSocket webSocket)
        {
            try
            {
                var userSockets = _chatSockets.GetOrAdd(chatId, new ConcurrentDictionary<int, WebSocket>());
                userSockets.TryAdd(userId, webSocket);

                await SendPendingMessages(userId, chatId);

                byte[] buffer = new byte[1024 * 4];
                WebSocketReceiveResult result;

                do
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        await HandleMessage(userId, chatId, message);
                    }
                }
                while (!result.CloseStatus.HasValue);

                WebSocket removedWebSocket;
                userSockets.TryRemove(userId, out removedWebSocket);
                await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                Console.WriteLine($"Usuario desconectado del chat {chatId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el WebSocket: {ex.Message}");
                Console.WriteLine($"Error interno: {ex.InnerException}");
            }
        }

        private async Task HandleMessage(int userId, string chatId, string message)
        {
            Chat? chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ChatId.ToString() == chatId);
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            Message newMessage = new Message
            {
                Content = message,
                User = user,
                Chat = chat,
                Date = DateTime.Now
            };
            Console.WriteLine($"{user.Name} en {chat.Name}: {message}. {newMessage.Date}");
            await _dbContext.Messages.AddAsync(newMessage);
            await _dbContext.SaveChangesAsync();

            string messageStr = $"{user.Name}¨{chat.Name}¨{newMessage.Date}¨{newMessage.Content}";

            // Send message only to users connected to this chat
            if (_chatSockets.TryGetValue(chatId, out var userSockets))
            {
                foreach (var pair in userSockets)
                {
                    if (pair.Value.State == WebSocketState.Open)
                    {
                        await SendMessage(pair.Value, messageStr);
                    }
                }
            }
        }

        private async Task SendPendingMessages(int userId, string chatId)
        {
            IEnumerable<Message> pendingMessages = await _dbContext.Messages
                .Where(m => m.Chat.ChatId.ToString() == chatId)
                .Include(m => m.User)
                .Include(m => m.Chat)
                .OrderBy(m => m.Date)
                .ToListAsync();

            foreach (var message in pendingMessages)
            {
                string messageStr = $"{message.User.Name}¨{message.Chat.Name}¨{message.Date}¨{message.Content}";
                if (_chatSockets.TryGetValue(chatId, out var userSockets) && userSockets.TryGetValue(userId, out var webSocket))
                {
                    await SendMessage(webSocket, messageStr);
                }
            }
        }

        private async Task SendMessage(WebSocket webSocket, string message)
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private async Task<int> ReadJwt(string token)
        {
            int id;
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    id = 0;
                }
                else
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.UTF8.GetBytes(_configuration["JWT_KEY"]);
                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateLifetime = true
                    }, out SecurityToken validatedToken);

                    var jwtToken = (JwtSecurityToken)validatedToken;
                    var claims = jwtToken.Claims;

                    string? userId = claims.FirstOrDefault(c => c.Type == "id")?.Value;
                    id = Int32.Parse(userId);
                }
            }
            catch (Exception)
            {
                id = 0;
            }
            return id;
        }
    }
}