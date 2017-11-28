using System;
using System.Threading.Tasks;
using LykkeCardWeb.Core.Domain;
using LykkeCardWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace LykkeCardWeb.Controllers
{
    public class SubscriberController : Controller
    {
        private readonly ISubscriberRepository _subscriberRepository;

        public SubscriberController(ISubscriberRepository subscriberRepository)
        {
            _subscriberRepository = subscriberRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Subscribe(SubscriberModel model)
        {
            try
            {
                var testEmail = await _subscriberRepository.GetAsync(model.Email);
                if (testEmail == null)
                {
                    await _subscriberRepository.CreateAsync(model);
                    return Json(new { error = "false" });
                }
            }
            catch
            {
                return Json(new { error = "true" });
            }

            return Json(new { error = "true" });
        }
    }
}
