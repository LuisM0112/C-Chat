namespace C_Chat_API.Helpers;

public static class Messages
{
    public static class User
    {
        public static readonly IDictionary<string, string> NotFound = new Dictionary<string, string>()
        {
            { "en", "User not found" },
            { "es", "Usuario no encontrado" },
        };
        public static readonly IDictionary<string, string> Registered = new Dictionary<string, string>()
        {
            { "en", "User registered" },
            { "es", "Usuario registrado" },
        };
        public static readonly IDictionary<string, string> AlreadyExists = new Dictionary<string, string>()
        {
            { "en", "User already exists" },
            { "es", "El usuario ya existe" },
        };
        public static readonly IDictionary<string, string> Deleted = new Dictionary<string, string>()
        {
            { "en", "User deleted" },
            { "es", "Usuario eliminado" },
        };
    }

    public static class Chat
    {
        public static readonly IDictionary<string, string> NotFound = new Dictionary<string, string>()
        {
            { "en", "Chat not found" },
            { "es", "Chat no encontrado" },
        };
        public static readonly IDictionary<string, string> Created = new Dictionary<string, string>()
        {
            { "en", "Chat created" },
            { "es", "Chat creado" },
        };
        public static readonly IDictionary<string, string> AlreadyExists = new Dictionary<string, string>()
        {
            { "en", "Chat already exists" },
            { "es", "El chat ya existe" },
        };
        public static readonly IDictionary<string, string> Deleted = new Dictionary<string, string>()
        {
            { "en", "Chat deleted" },
            { "es", "Chat eliminado" },
        };
    }

    public static class Message
    {
        public const string NotFound = "Message not found";
        public const string Created = "Message sent";
        public const string Deleted = "Message deleted";
    }

    public static class UserChat
    {
        public static readonly IDictionary<string, string> UserToAddNotFound = new Dictionary<string, string>()
        {
            { "en", "User to add not found" },
            { "es", "Usuario a añadir no encontrado" },
        };
        public static readonly IDictionary<string, string> DontBelongToChat = new Dictionary<string, string>()
        {
            { "en", "You don't belong to the chat" },
            { "es", "No perteneces al chat" },
        };
        public static readonly IDictionary<string, string> UserAdded = new Dictionary<string, string>()
        {
            { "en", "User added to chat" },
            { "es", "Usuario añadido al chat" },
        };
        public static readonly IDictionary<string, string> UserAlreadyInChat = new Dictionary<string, string>()
        {
            { "en", "User already in the chat" },
            { "es", "El usuario ya está en el chat" },
        };
        public static readonly IDictionary<string, string> ChatLeaved = new Dictionary<string, string>()
        {
            { "en", "Chat leaved" },
            { "es", "Chat abandonado" },
        };
    }

    public static class Form
    {
        public static readonly IDictionary<string, string> PasswordsDoesntMatch = new Dictionary<string, string>()
        {
            { "en", "Passwords doesn't match" },
            { "es", "Las contraseñas no coinciden" },
        };
        public static readonly IDictionary<string, string> MissingFields = new Dictionary<string, string>()
        {
            { "en", "Fill in all fields" },
            { "es", "Rellene todos los campos" },
        };
        public static readonly IDictionary<string, string> IncorrectEmailOrPassword = new Dictionary<string, string>()
        {
            { "en", "Incorrect email or password" },
            { "es", "Email o contraseña incorrectos" },
        };
        public static readonly IDictionary<string, string> InvalidOrNotFoundToken = new Dictionary<string, string>()
        {
            { "en", "Invalid or not found Token" },
            { "es", "Token invalido o no encontrado" },
        };
    }
}
