using System.Collections.Generic;
using System.Threading.Tasks;

namespace LykkeCardWeb.Core.Domain
{
    public interface ISubscriber
    {
        string Email { get; }
    }


    public interface ISubscriberRepository
    {
        Task<ISubscriber> CreateAsync(ISubscriber subscriber);
        Task<ISubscriber> GetAsync(string email);
    }
}
