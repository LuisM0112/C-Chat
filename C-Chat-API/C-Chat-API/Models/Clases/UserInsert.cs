
using Microsoft.IdentityModel.Tokens;

namespace C_Chat_API.Models.Clases
{
    public class UserInsert
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PasswordBis { get; set; }

        public static bool isAnyFieldNullOrEmpty(UserInsert user)
        {
            return user.Name.IsNullOrEmpty() || user.Email.IsNullOrEmpty() || user.Password.IsNullOrEmpty() || user.PasswordBis.IsNullOrEmpty();
        }

        public static bool ArePasswordsDifferent(UserInsert user)
        {
            return user.Password != user.PasswordBis;
        }
    }
}
