using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;

namespace C_Chat_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebSocketController : ControllerBase
    {
        [Route("/ws")]
        [HttpGet]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await ProcessWebSocket(webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        private async Task ProcessWebSocket(WebSocket webSocket)
        {
            byte[] buffer = new byte[1024 * 4];
            WebSocketReceiveResult receiveResult;

            do
            {
                receiveResult = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

                await webSocket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                    receiveResult.MessageType,
                    receiveResult.EndOfMessage,
                    CancellationToken.None);
            }
            while (!receiveResult.CloseStatus.HasValue);

            await webSocket.CloseAsync(
                receiveResult.CloseStatus.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None);
        }
    }
}
