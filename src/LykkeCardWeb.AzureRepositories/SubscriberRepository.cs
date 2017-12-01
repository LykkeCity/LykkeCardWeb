using System;
using System.Threading.Tasks;
using AzureStorage;
using LykkeCardWeb.Core.Domain;
using Microsoft.WindowsAzure.Storage.Table;

namespace LykkeCardWeb.AzureRepositories
{
    public class Subscriber : TableEntity, ISubscriber
    {
        public string Email => RowKey;

        public static string GeneratePartitionKey()
        {
            return "Subscriber";
        }

        public static string GenerateRowKey(string email)
        {
            return email;
        }

        public static Subscriber Create(ISubscriber subscriber)
        {
            var result = new Subscriber
            {
                PartitionKey = GeneratePartitionKey(),
                RowKey = GenerateRowKey(subscriber.Email)
            };

            return result;
        }
    }

    public class SubscriberRepository : ISubscriberRepository
    {
        private readonly INoSQLTableStorage<Subscriber> _tableStorage;

        public SubscriberRepository(INoSQLTableStorage<Subscriber> tableStorage)
        {
            _tableStorage = tableStorage;
        }

        public async Task<ISubscriber> GetAsync(string email)
        {
            var partitionKey = Subscriber.GeneratePartitionKey();
            var rowKey = email;

            return await _tableStorage.GetDataAsync(partitionKey, rowKey);
        }

        public async Task<ISubscriber> CreateAsync(ISubscriber subscriber)
        {
            var partitionKey = Subscriber.GeneratePartitionKey();
            var rowKey = Subscriber.GenerateRowKey(subscriber.Email);

            var entity = await _tableStorage.GetDataAsync(partitionKey, rowKey);

            if (entity != null) throw new Exception("Email exists: " + subscriber.Email);

            var newEntity = Subscriber.Create(subscriber);
            await _tableStorage.InsertAsync(newEntity);

            return newEntity;
        }
    }
}
