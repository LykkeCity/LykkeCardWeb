using Autofac;
using Common.Log;
using Lykke.SettingsReader;
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

        }
    }
}
