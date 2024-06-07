using C_Chat_API.Models;
using C_Chat_API.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class Program
{
    public static async Task Main(string[] args)
    {
        Directory.SetCurrentDirectory(AppContext.BaseDirectory);
        Directory.CreateDirectory("wwwroot");

        String policyName = "_myAllowSpecificOrigins";

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: policyName, builder =>
            {
                builder.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddSingleton<FileService>();

        try
        {
            var connectionString = builder.Configuration.GetConnectionString("AppDbConnectionString");
            builder.Services.AddDbContext<ChatContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        builder.Services.AddAuthentication()
                        .AddJwtBearer(options =>
                        {
                            // string key = Environment.GetEnvironmentVariable("JWT_KEY");
                            string key = (string)builder.Configuration.GetValue(typeof(string),"JWT_KEY");

                            options.TokenValidationParameters = new TokenValidationParameters()
                            {
                                ValidateIssuer = false,
                                ValidateAudience = false,
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                            };
                        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<ChatContext>();
                context.Database.Migrate();  // Apply any pending migrations
                context.Seed();  // Seed the database
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred seeding the database.");
            }
        }

        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    var errorDetails = new
                    {
                        StatusCode = context.Response.StatusCode,
                        Message = "Internal Server Error.",
                        Detailed = contextFeature.Error.Message
                    };

                    var logger = app.Services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(contextFeature.Error, "An unhandled exception occurred.");

                    await context.Response.WriteAsJsonAsync(errorDetails);
                }
            });
        });

        // Configure the HTTP request pipeline.
        // if (app.Environment.IsDevelopment())
        // {
        app.UseSwagger();
        app.UseSwaggerUI();


        // }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseCors(policyName);

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseWebSockets();

        app.MapControllers();


        await app.RunAsync();
    }
}