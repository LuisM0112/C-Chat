using C_Chat_API.Helpers;
using C_Chat_API.Models;
using C_Chat_API.Models.Clases;
using C_Chat_API.Models.Dto;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace C_Chat_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private ChatContext _dbContext;
        private readonly TokenValidationParameters _tokenParameters;

        public AuthController(IOptionsMonitor<JwtBearerOptions> jwtOptions ,ChatContext dbContext)
        {
            _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme)
                .TokenValidationParameters;
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            return _dbContext.Users.Select(UserDto.ToDto).ToList();
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            IActionResult response;
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                response = NotFound(Messages.User.NotFound);
            }
            else
            {
                response = Ok(UserDto.ToDto(user));
            }
            return response;
        }

        [HttpPost("SignUp")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostSignUp([FromForm] UserInsert incomingNewUser)
        {
            IActionResult response;
            try
            {
                if (incomingNewUser.Password != incomingNewUser.PasswordBis)
                {
                    response = BadRequest(Messages.Form.PasswordsDoesntMatch);
                }
                else
                {
                    User newUser = new User()
                    {
                        Name = incomingNewUser.Name,
                        Email = incomingNewUser.Email,
                        Password = incomingNewUser.Password
                    };

                    await _dbContext.Users.AddAsync(newUser);
                    await _dbContext.SaveChangesAsync();

                    response = StatusCode(201, Messages.User.Registered);
                }
            } catch (DbUpdateException ex)
            {
                if (ex.InnerException == null)
                {
                    response = BadRequest(ex.Message);
                }
                else
                {
                    SqliteException sqliteException = (SqliteException)ex.InnerException;
                    if (sqliteException.SqliteExtendedErrorCode == 2067) // Unique Constraint (SQLite extended error: 2067)
                    {
                        response = BadRequest(Messages.User.AlreadyExists);
                    }
                    else if (sqliteException.SqliteExtendedErrorCode == 1299) // Required Constraint (SQLite extended error: 1299)
                    {
                        response = BadRequest(Messages.Form.MissingFields);
                    }
                    else response = BadRequest(sqliteException.Message);
                }
            }
            return response;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            IActionResult response;
            try
            {
                string? userIdstr = User?.FindFirst("id")?.Value;
                if (userIdstr == null)
                {
                    response = BadRequest(Messages.Form.InvalidOrNotFoundToken);
                }
                else
                {
                    int userId = Int32.Parse(userIdstr);
                    User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);

                    if (user == null)
                    {
                        response = NotFound(Messages.User.NotFound);
                    }
                    else
                    {
                        _dbContext.Users.Remove(user);
                        await _dbContext.SaveChangesAsync();
                        response = Ok(Messages.User.Deleted);
                    }
                }
                
            }
            catch (FormatException ex)
            {
                response = BadRequest(Messages.Form.InvalidOrNotFoundToken);
            }
            catch (DbUpdateException ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        [HttpPost("Login")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostLogin([FromForm] UserLogin IncomingLoginUser)
        {
            IActionResult response;
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(IncomingLoginUser.Email));
            if (user == null)
            {
                response = BadRequest(Messages.Form.IncorrectEmailOrPassword);
            }
            else
            {
                if (!user.Password.Equals(IncomingLoginUser.Password))
                {
                    response = BadRequest(Messages.Form.IncorrectEmailOrPassword);
                }
                else
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Claims = new Dictionary<string, object>
                        {
                            { "id", user.UserId.ToString() },
                            { ClaimTypes.Role, user.Role.ToString() }
                        },

                        Expires = DateTime.UtcNow.AddYears(5),
                        SigningCredentials = new SigningCredentials(
                            _tokenParameters.IssuerSigningKey,
                            SecurityAlgorithms.HmacSha256Signature
                            )
                    };
                    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                    string stringToken = tokenHandler.WriteToken(token);

                    response = Ok(stringToken);
                }
            }
            return response;
        }
    }
}
