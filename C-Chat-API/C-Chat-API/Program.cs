using C_Chat_API.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddScoped<ChatContext>();

        builder.Services.AddAuthentication()
                        .AddJwtBearer(options =>
                        {
                            string key = Environment.GetEnvironmentVariable("JWT_KEY");

                            options.TokenValidationParameters = new TokenValidationParameters()
                            {
                                ValidateIssuer = false,
                                ValidateAudience = false,
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                            };
                        });

        var app = builder.Build();

        using (IServiceScope scope = app.Services.CreateScope())
        {
            ChatContext dbContext = scope.ServiceProvider.GetRequiredService<ChatContext>(); // "Required" == !null
            dbContext.Database.EnsureCreated();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors(config => config
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .SetIsOriginAllowed(origin => true)
                            .AllowCredentials());
        }

        app.UseHttpsRedirection();
        app.UseWebSockets();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.UseStaticFiles();

        await app.RunAsync();
    }
}