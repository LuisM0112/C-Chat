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

    public static class Chat
    {
        public const string NotFound = "Chat not found";
        public const string Created = "Chat created";
        public const string Deleted = "Chat deleted";
        public const string AlreadyExists = "Chat already exists";
    }

    public static class Message
    {
        public const string NotFound = "Message not found";
        public const string Created = "Message sent";
        public const string Deleted = "Message deleted";
    }

    public static class UserChat
    {
        public const string UserToAddNotFound = "User to add not found";
        public const string DontBelongToChat = "you don't belong to the chat";
        public const string UserAdded = "User added to chat";
        public const string UserAlreadyInChat = "User already in the chat";
        public const string ChatLeaved = "Chat leaved";
    }

    public static class Form
    {
        public const string PasswordsDoesntMatch = "Passwords doesn't match";
        public const string MissingFields = "Fill in all fields";
        public const string IncorrectEmailOrPassword = "Incorrect email or password";
        public const string InvalidOrNotFoundToken = "Invalid or not found Token";
    }
}
