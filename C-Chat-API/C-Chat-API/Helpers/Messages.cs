namespace C_Chat_API.Helpers;

public static class Messages
{
    public static class User
    {
        public const string NotFound = "User not found";
        public const string Registered = "User registered";
        public const string AlreadyExists = "User already exists";
        public const string Deleted = "User deleted";
    }

    public static class Form
    {
        public const string PasswordsDoesntMatch = "Passwords doesn't match";
        public const string MissingFields = "Fill in all fields";
        public const string IncorrectEmailOrPassword = "Incorrect email or password";
        public const string InvalidOrNotFoundToken = "Invalid or not found Token";
    }
}
