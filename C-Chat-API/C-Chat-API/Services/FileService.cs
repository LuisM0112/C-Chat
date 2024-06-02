namespace C_Chat_API.Services
{
    public class FileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveAsync(Stream stream, string folder, string name)
        {
            using MemoryStream streamAux = new MemoryStream();
            await stream.CopyToAsync(streamAux);
            byte[] bytes = streamAux.ToArray();

            return await SaveAsync(bytes, folder, name);
        }

        public async Task<string> SaveAsync(byte[] bytes, string folder, string name)
        {
            string directory = Path.Combine("wwwroot", folder);
            Directory.CreateDirectory(directory);

            string absolutePath = Path.Combine(directory, name);
            await File.WriteAllBytesAsync(absolutePath, bytes);

            string relativePath = $"{folder}/{name}";

            return relativePath;
        }
    }
}
