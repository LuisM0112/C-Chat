using C_Chat_API.Helpers;
using C_Chat_API.Models;
using C_Chat_API.Models.Clases;
using C_Chat_API.Models.Dto;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace C_Chat_API.Controllers
{
    [Route("api/{language}/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private ChatContext _dbContext;

        public ChatController(ChatContext dbContext)
        {
            _dbContext = dbContext;
        }

        /* ---------- GET ---------- */

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public ActionResult<IEnumerable<ChatDto>> GetChats()
        {
            return _dbContext.Chats.Select(ChatDto.ToDto).ToList();
        }

        [HttpGet("{chatId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetChat(string language, int chatId)
        {
            IActionResult response;
            Chat? chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ChatId == chatId);
            if (chat == null)
            {
                response = NotFound(Messages.Chat.NotFound[language]);
            }
            else
            {
                response = Ok(ChatDto.ToDto(chat));
            }
            return response;
        }

        [HttpGet("MyChats")]
        public async Task<IActionResult> GetUserChats(string language)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else
                    {
                        IEnumerable<Chat> chats = await _dbContext.UserChats
                            .Where(uc => uc.User.UserId == userId)
                            .Select(uc => uc.Chat)
                            .ToListAsync();

                        IEnumerable<ChatDto> chatDtos = chats.Select(ChatDto.ToDto);

                        response = Ok(chatDtos);
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        [HttpGet("UsersInChat/{chatId}")]
        public async Task<IActionResult> GetUsersInChat(string language, int chatId)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else
                    {
                        UserChat? userChat = await _dbContext.UserChats.FirstOrDefaultAsync(uc => uc.User.UserId == userId && uc.Chat.ChatId == chatId);
                        if (userChat == null)
                        {
                            response = Unauthorized(Messages.UserChat.DontBelongToChat[language]);
                        }
                        else
                        {
                            Chat? chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ChatId == chatId);
                            IEnumerable<User> users = await _dbContext.Users.Where(u => u.UsersChats.Any(uc => uc.Chat.ChatId == chatId)).ToListAsync();
                            IEnumerable<UserDto> usersDto = users.Select(UserDto.ToDto);
                            response = Ok(usersDto);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        /* ---------- POST ---------- */

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostNewChat(string language, [FromForm] ChatInsert incomingNewChat)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else if (incomingNewChat.Name.IsNullOrEmpty())
                    {
                        response = BadRequest(Messages.Form.MissingFields[language]);
                    }
                    else
                    {
                        Chat newChat = new Chat()
                        {
                            Name = incomingNewChat.Name,
                            CreationDate = DateTime.Now,
                        };

                        await _dbContext.Chats.AddAsync(newChat);
                        await _dbContext.SaveChangesAsync();

                        // Adds the user who created the chat to it
                        UserChat newUserChat = new UserChat()
                        {
                            User = user,
                            Chat = newChat
                        };

                        await _dbContext.UserChats.AddAsync(newUserChat);
                        await _dbContext.SaveChangesAsync();

                        response = StatusCode(201, Messages.Chat.Created[language]);
                    }
                }
            }
            catch (DbUpdateException ex)
            {
                response = ControllerHelper.HandleDbUpdateException(ex, language, false);
            }
            return response;
        }

        [HttpPost("AddUserToChat")]
        public async Task<IActionResult> PostAddUserToChat(string language, [FromForm] UserChatInsert incomingNewUserChat)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else
                    {
                        Chat? chat = await _dbContext.UserChats
                            .Where(uc => uc.User.UserId == userId && uc.Chat.ChatId == incomingNewUserChat.ChatId)
                            .Select(uc => uc.Chat)
                            .FirstOrDefaultAsync();
                        if (chat == null)
                        {
                            response = Unauthorized(Messages.UserChat.DontBelongToChat[language]);
                        }
                        else
                        {
                            User? userToAdd = await _dbContext.Users.FirstOrDefaultAsync(u => u.Name == incomingNewUserChat.UserName);
                            if (userToAdd == null)
                            {
                                response = NotFound(Messages.UserChat.UserToAddNotFound[language]);
                            }
                            else if (await _dbContext.UserChats.AnyAsync(uc => uc.User.Name == userToAdd.Name && uc.Chat.ChatId == chat.ChatId))
                            {
                                response = BadRequest(Messages.UserChat.UserAlreadyInChat[language]);
                            }
                            else
                            {
                                UserChat newUserChat = new UserChat()
                                {
                                    User = userToAdd,
                                    Chat = chat
                                };

                                await _dbContext.UserChats.AddAsync(newUserChat);
                                await _dbContext.SaveChangesAsync();

                                response = Ok(Messages.UserChat.UserAdded[language]);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        /* ---------- DELETE ---------- */

        [HttpDelete("{chatId}")]
        public async Task<IActionResult> DeleteChat(string language, int chatId)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else
                    {
                        UserChat? userChat = await _dbContext.UserChats.FirstOrDefaultAsync(uc => uc.User.UserId == userId && uc.Chat.ChatId == chatId);
                        if (userChat == null)
                        {
                            response = Unauthorized(Messages.UserChat.DontBelongToChat[language]);
                        }
                        else
                        {
                            Chat? chat = await _dbContext.Chats.FirstOrDefaultAsync(c => c.ChatId == chatId);

                            _dbContext.Chats.Remove(chat);
                            await _dbContext.SaveChangesAsync();
                            response = Ok(Messages.Chat.Deleted[language]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        [HttpDelete("LeaveChat/{chatId}")]
        public async Task<IActionResult> DeleteLeaveChat(string language, int chatId)
        {
            IActionResult response;
            try
            {
                int? userId = await ControllerHelper.GetUserIdFromClaims(User);
                if (userId == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken[language]);
                }
                else
                {
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound[language]);
                    }
                    else
                    {
                        UserChat? userChat = await _dbContext.UserChats.FirstOrDefaultAsync(uc => uc.User.UserId == userId && uc.Chat.ChatId == chatId);
                        if (userChat == null)
                        {
                            response = Unauthorized(Messages.UserChat.DontBelongToChat[language]);
                        }
                        else
                        {

                            _dbContext.UserChats.Remove(userChat);
                            await _dbContext.SaveChangesAsync();

                            response = Ok(Messages.UserChat.ChatLeaved[language]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }
    }
}
