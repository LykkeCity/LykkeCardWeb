using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace LykkeCardWeb.Infrastucture
{
    public class AuthEvents : OpenIdConnectEvents
    {
        public override Task RemoteFailure(RemoteFailureContext context)
        {
            context.HandleResponse();
            context.Response.Redirect("/Home/Index");

            return Task.FromResult(0);
        }

        public override async Task TokenValidated(TokenValidatedContext context)
        {
            await base.TokenValidated(context);
        }

        public override Task TicketReceived(TicketReceivedContext context)
        {
            context.Properties.Items.Clear();
            context.Properties.Items.Clear();

            foreach (var principalClaim in context.Principal.Claims)
            {
                principalClaim.Properties.Clear();
            }

            return base.TicketReceived(context);
        }
    }
}
