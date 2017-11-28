using LykkeCardWeb.Core.Domain;

namespace LykkeCardWeb.Models
{
    public class SubscriberModel : ISubscriber
    {
        public string Email { get; set; }

        public static SubscriberModel Get(ISubscriber subscriber)
        {
            var result = new SubscriberModel
            {
                Email = subscriber.Email,
            };

            return result;
        }
    }
}
