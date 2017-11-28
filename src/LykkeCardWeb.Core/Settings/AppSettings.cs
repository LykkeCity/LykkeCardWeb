using LykkeCardWeb.Core.Settings.ClientsSettings;
using LykkeCardWeb.Core.Settings.SiteSettings;
using LykkeCardWeb.Core.Settings.SlackNotifications;

namespace LykkeCardWeb.Core.Settings
{
    public class AppSettings
    {
        public WebSiteSettings LykkeVisaCardWeb { get; set; }
        public SlackNotificationsSettings SlackNotifications { get; set; }
        public VisaServiceClient VisaServiceClient { get; set; }
    }
}
