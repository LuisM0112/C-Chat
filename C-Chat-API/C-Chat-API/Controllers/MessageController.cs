using C_Chat_API.Helpers;
using C_Chat_API.Models;
using C_Chat_API.Models.Dto;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace C_Chat_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private ChatContext _dbContext;

        public MessageController(ChatContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<MessageDto>> GetMessages()
        {
            return _dbContext.Messages.Select(MessageDto.ToDto).ToList();
        }

        [HttpGet("{messageId}")]
        public async Task<IActionResult> GetMessage(int messageId)
        {
            IActionResult response;
            Message? message = await _dbContext.Messages.FirstOrDefaultAsync(m => m.MessageId == messageId);
            if (message == null)
            {
                response = NotFound(Messages.Message.NotFound);
            }
            else
            {
                response = Ok(MessageDto.ToDto(message));
            }
            return response;
        }
    }
}
