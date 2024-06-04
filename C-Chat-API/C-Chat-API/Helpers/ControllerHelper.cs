using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System.Security.Claims;
namespace C_Chat_API.Helpers
{ 
    public static class ControllerHelper
    {
        public static async Task<int?> GetUserIdFromClaims(ClaimsPrincipal user)
        {
            string? userIdStr = user?.FindFirst("id")?.Value;
            return userIdStr == null ? null : int.Parse(userIdStr);
        }
        
        public static IActionResult HandleDbUpdateException(DbUpdateException ex, bool isForUser)
        {
            IActionResult result;
            if (ex.InnerException is MySqlException mySqlException)
            {
                switch (mySqlException.ErrorCode.ToString())
                {
                    case "DuplicateKeyEntry":
                        result = new BadRequestObjectResult( isForUser ? Messages.User.AlreadyExists : Messages.Chat.AlreadyExists );
                        break;
                    case "ColumnCannotBeNull":
                        result = new BadRequestObjectResult(Messages.Form.MissingFields);
                        break;
                    default:
                        result = new BadRequestObjectResult(ex.Message);
                        break;
                }
            } else
            {
                result = new BadRequestObjectResult(ex.Message);
            }
            return result;
        }
    }
}