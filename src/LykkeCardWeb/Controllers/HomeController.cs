using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LykkeCardWeb.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("auth")]
        [HttpPost("auth")]
        public IActionResult Auth()
        {
            return RedirectToAction("Index", User.Identity.IsAuthenticated ? "MyCards" : "Home");
        }

        [HttpGet("countries")]
        public IActionResult Countries()
        {
            return View();
        }

        [HttpGet("signin")]
        public IActionResult SignIn()
        {
            return Challenge(new AuthenticationProperties { RedirectUri = Url.Action("Index", "MyCards") });
        }

        [HttpGet("logout")]
        public IActionResult LogOut()
        {
            var redirectUrl = Request.Headers["Referer"].ToString();

            if (User.Identity.IsAuthenticated)
            {
                //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                //await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
                return SignOut(new AuthenticationProperties { RedirectUri = "/" },
                    CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme);
            }

            if (!string.IsNullOrEmpty(redirectUrl))
            {
                return Redirect(redirectUrl);
            }

            return RedirectToAction("Index", "Home");
        }
    }
}
