﻿namespace LykkeCardWeb.Core.Settings.SlackNotifications
{
    public class SlackNotificationsSettings
    {
        public AzureQueueSettings AzureQueue { get; set; }

        public int ThrottlingLimitSeconds { get; set; }
    }
}
