using C_Chat_API.Models;
using C_Chat_API.Models.Clases;
using C_Chat_API.Models.Dto;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
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
                response = NotFound("User not found");
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
                    response = BadRequest("Passwords doesn't match");
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

                    response = StatusCode(201, "User registered");
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
                    if (sqliteException.SqliteExtendedErrorCode == 2067)
                    {
                        response = BadRequest("User already exists");
                    }
                    else if (sqliteException.SqliteExtendedErrorCode == 1299)
                    {
                        response = BadRequest("Fill in all fields");
                    }
                    else response = BadRequest(sqliteException.Message);
                }
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
                response = BadRequest("Incorrect password or email");
            }
            else
            {
                if (!user.Password.Equals(IncomingLoginUser.Password))
                {
                    response = BadRequest("Incorrect password or email");
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
