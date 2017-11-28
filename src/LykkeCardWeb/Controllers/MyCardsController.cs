using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LykkeCardWeb.Controllers
{
    [Authorize]
    [Route("mycards")]
    public class MyCardsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
