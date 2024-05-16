using C_Chat_API.Models;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;

namespace C_Chat_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebSocketController : ControllerBase
    {
        private static ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();
        private readonly ChatContext _dbContext;

        public WebSocketController(ChatContext dbContext)
        {
            _dbContext = dbContext;
        }

        [Route("/ws")]
        [HttpGet]
        public async Task Get(string userId, string chatId)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await ConnectWebSocket(userId, chatId, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        private async Task ConnectWebSocket(string userId, string chatId, WebSocket webSocket)
        {
            try
            {
                _sockets.TryAdd(userId, webSocket);

                await SendPendingMessages(userId, chatId);

                var buffer = new byte[1024 * 4];
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
                _sockets.TryRemove(userId, out removedWebSocket);
                await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el WebSocket: {ex.Message}");
            }
        }

        private async Task HandleMessage(string userId, string chatId, string message)
        {
            Chat? chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ChatId.ToString() == chatId);
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);
            // Save message to the database
            var newMessage = new Message
            {
                Content = message,
                User = user,
                Chat = chat,
                Date = DateTime.Now
            };
            await _dbContext.Messages.AddAsync(newMessage);
            await _dbContext.SaveChangesAsync();

            // Send message to all users in the chat
            foreach (var pair in _sockets)
            {
                if (pair.Key != userId && pair.Value.State == WebSocketState.Open)
                {
                    await SendMessage(pair.Value, message);
                }
            }
        }

        private async Task SendPendingMessages(string userId, string chatId)
        {
            var pendingMessages = await _dbContext.Messages
                .Where(m => m.Chat.ChatId.ToString() == chatId)
                .OrderBy(m => m.Date)
                .ToListAsync();

            foreach (var message in pendingMessages)
            {
                await SendMessage(_sockets[userId], message.Content);
            }
        }

        private async Task SendMessage(WebSocket webSocket, string message)
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}
