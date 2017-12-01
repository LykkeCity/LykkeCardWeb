using Autofac;
using AzureStorage.Tables;
using Common.Log;
using Lykke.Service.Visa.Client;
using Lykke.SettingsReader;
using LykkeCardWeb.AzureRepositories;
using LykkeCardWeb.Core.Domain;
using LykkeCardWeb.Core.Settings;

namespace LykkeCardWeb.Mudules
{
    public class WebsiteModule : Module
    {
        private readonly IReloadingManager<AppSettings> _settings;
        private readonly ILog _log;

        public WebsiteModule(IReloadingManager<AppSettings> settings, ILog log)
        {
            _settings = settings;
            _log = log;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterInstance(_log)
                .As<ILog>()
                .SingleInstance();

            builder.RegisterVisaCardClient(_settings.CurrentValue.VisaServiceClient.ServiceUrl, _log);

            builder.RegisterInstance<ISubscriberRepository>(
                new SubscriberRepository(AzureTableStorage<Subscriber>.Create(_settings.ConnectionString(x => x.LykkeVisaCardWeb.Db.LykkeConnString), "LykkeSubscribers", _log))
            ).SingleInstance();
        }
    }
}
