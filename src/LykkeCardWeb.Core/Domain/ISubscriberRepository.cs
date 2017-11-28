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
        Task<IEnumerable<ISubscriber>> GetAllAsync();
        Task<ISubscriber> GetAsync(string email);

        Task<ISubscriber> CreateAsync(ISubscriber subscriber);
        Task DeleteAsync(string email);
    }
}
