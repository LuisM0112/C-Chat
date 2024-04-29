using C_Chat_API.Models.Entities;

namespace C_Chat_API.Models.Dto
{
    public class UserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public static UserDto ToDto(User user)
        {
            return new UserDto
            {
                Name = user.Name,
                Email = user.Email
            };
        }
    }
}
