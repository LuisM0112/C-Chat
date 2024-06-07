using C_Chat_API.Helpers;
using C_Chat_API.Models;
using C_Chat_API.Models.Clases;
using C_Chat_API.Models.Dto;
using C_Chat_API.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace C_Chat_API.Controllers
{
    [Route("api/{language}/[controller]")]
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

        /* ---------- GET ---------- */

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            return _dbContext.Users.Select(UserDto.ToDto).ToList();
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUser(string language, int userId)
        {
            IActionResult response;
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                response = NotFound(Messages.User.NotFound[language]);
            }
            else
            {
                response = Ok(UserDto.ToDto(user));
            }
            return response;
        }

        [HttpGet("UserData")]
        public async Task<IActionResult> GetUser(string language)
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
                        response = Ok(user.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }

        [HttpGet("AmIAdmin")]
        public async Task<bool> GetAmIAdmin()
        {
            var userRoles = User.Claims
                            .Where(c => c.Type == ClaimTypes.Role)
                            .Select(c => c.Value)
                            .ToList();

            bool isAdmin = userRoles.Contains("ADMIN");
            return isAdmin;
        }

        /* ---------- POST ---------- */

        [HttpPost("SignUp")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostSignUp(string language, [FromForm] UserInsert incomingNewUser)
        {
            IActionResult response;
            try
            {
                if (UserInsert.isAnyFieldNullOrEmpty(incomingNewUser))
                {
                    response = BadRequest(Messages.Form.MissingFields[language]);
                }
                else if (UserInsert.ArePasswordsDifferent(incomingNewUser))
                {
                    response = BadRequest(Messages.Form.PasswordsDoesntMatch[language]);
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

                    response = StatusCode(201, Messages.User.Registered[language]);
                }
            } catch (DbUpdateException ex)
            {
                response = ControllerHelper.HandleDbUpdateException(ex, language, true);
            }
            return response;
        }

        [HttpPost("Login")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostLogin(string language, [FromForm] UserLogin IncomingLoginUser)
        {
            IActionResult response;
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(IncomingLoginUser.Email));
            if (user == null)
            {
                response = BadRequest(Messages.Form.IncorrectEmailOrPassword[language]);
            }
            else
            {
                if (!user.Password.Equals(IncomingLoginUser.Password))
                {
                    response = BadRequest(Messages.Form.IncorrectEmailOrPassword[language]);
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

        /* ---------- DELETE ---------- */

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string language)
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
                        _dbContext.Users.Remove(user);
                        await _dbContext.SaveChangesAsync();
                        response = Ok(Messages.User.Deleted[language]);
                    }
                }
                
            }
            catch (DbUpdateException ex)
            {
                response = BadRequest(ex.Message);
            }
            return response;
        }
    }
}
