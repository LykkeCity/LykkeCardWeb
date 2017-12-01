using System.Linq;
using System.Security.Claims;

namespace LykkeCardWeb.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetClientId(this ClaimsPrincipal user)
        {
            return user.Claims.First(item => item.Type == ClaimTypes.NameIdentifier).Value;
        }
    }
}
