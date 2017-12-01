using System.Threading.Tasks;
using LykkeCardWeb.Core.Domain;
using LykkeCardWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace LykkeCardWeb.Controllers
{
    [Route("api/[controller]")]
    public class SubscriberController : Controller
    {
        private readonly ISubscriberRepository _subscriberRepository;

        public SubscriberController(ISubscriberRepository subscriberRepository)
        {
            _subscriberRepository = subscriberRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Subscribe([FromBody]SubscriberModel model)
        {
            try
            {
                var testEmail = await _subscriberRepository.GetAsync(model.Email);

                if (testEmail == null)
                {
                    await _subscriberRepository.CreateAsync(model);
                    return Json(new { error = string.Empty });
                }

                return Json(new { error = "You are already subscribed" });
            }
            catch
            {
                return Json(new { error = "Technical problem. Try again later" });
            }
        }
    }
}
