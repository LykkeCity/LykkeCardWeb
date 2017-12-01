using System;
using System.IO;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using AzureStorage.Blob;
using Common;
using Lykke.SettingsReader;
using Microsoft.AspNetCore.Hosting;

namespace LykkeCardWeb
{
    public class Program
    {
        public static string EnvInfo => Environment.GetEnvironmentVariable("ENV_INFO");

        public static void Main(string[] args)
        {
            Console.WriteLine($"LykkeCardWeb version {Microsoft.Extensions.PlatformAbstractions.PlatformServices.Default.Application.ApplicationVersion}");
#if DEBUG
            Console.WriteLine("Is DEBUG");
#else
            Console.WriteLine("Is RELEASE");
#endif           
            Console.WriteLine($"ENV_INFO: {EnvInfo}");

            try
            {
                var sertConnString = Environment.GetEnvironmentVariable("CertConnectionString");

                if (string.IsNullOrWhiteSpace(sertConnString) || sertConnString.Length < 10)
                {
                    var host = new WebHostBuilder()
                        .UseKestrel()
                        .UseUrls("http://*:5000")
                        .UseContentRoot(Directory.GetCurrentDirectory())
                        .UseStartup<Startup>()
                        .UseApplicationInsights()
                        .Build();

                    host.Run();
                }
                else
                {
                    var sertContainer = Environment.GetEnvironmentVariable("CertContainer");
                    var sertFilename = Environment.GetEnvironmentVariable("CertFileName");
                    var sertPassword = Environment.GetEnvironmentVariable("CertPassword");

                    var certBlob = new AzureBlobStorage(sertConnString);
                    var cert = certBlob.GetAsync(sertContainer, sertFilename).Result.ToBytes();

                    X509Certificate2 xcert = new X509Certificate2(cert, sertPassword);

                    var host = new WebHostBuilder()
                        .UseKestrel(x =>
                        {
                            x.Listen(IPAddress.Any, 443, listenOptions => listenOptions.UseHttps(xcert));
                            x.AddServerHeader = false;
                        })
                        .UseContentRoot(Directory.GetCurrentDirectory())
                        .UseUrls("https://*:443/")
                        .UseStartup<Startup>()
                        .Build();

                    host.Run();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fatal error:");
                Console.WriteLine(ex);

                // Lets devops to see startup error in console between restarts in the Kubernetes
                var delay = TimeSpan.FromMinutes(1);

                Console.WriteLine();
                Console.WriteLine($"Process will be terminated in {delay}. Press any key to terminate immediately.");

                Task.WhenAny(
                        Task.Delay(delay),
                        Task.Run(() =>
                        {
                            Console.ReadKey(true);
                        }))
                    .Wait();
            }

            Console.WriteLine("Terminated");
        }
    }
}
