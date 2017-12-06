using System.Collections.Generic;
using System.Threading.Tasks;
using Lykke.Service.Visa.Client;
using Lykke.Service.Visa.Client.AutorestClient.Models;
using Lykke.Service.Visa.Client.Models;
using LykkeCardWeb.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LykkeCardWeb.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class CardsController : Controller
    {
        private readonly IVisaCardClient _visaCardClient;

        public CardsController(IVisaCardClient visaCardClient)
        {
            _visaCardClient = visaCardClient;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetCards()
        {
            try
            {
                var clientId = User.GetClientId();
                var cards = await _visaCardClient.GetClientCardsAsync(clientId);
                return Ok(cards.Result);
            }
            catch
            {
                return BadRequest(new ApiResponse<IEnumerable<VisaCard>> { Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem") });
            }
        }

        [HttpGet]
        [Route("settings")]
        public async Task<IActionResult> GetSettings()
        {
            try
            {
                var clientId = User.GetClientId();
                var settings = await _visaCardClient.GetSettingsAndValidateAsync(clientId);
                return Ok(settings);
            }
            catch
            {
                return BadRequest(new ApiResponse<SettingsResponse> { Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem") });
            }
        }

        [HttpPost]
        [Route("createRequest")]
        public async Task<IActionResult> CreateCardRequest([FromBody]CreateCardRequestModel model)
        {
            try
            {
                var clientId = User.GetClientId();
                model.ClientId = clientId;

                var result = await _visaCardClient.CardRequestAsync(model);

                return Ok(result);
            }
            catch
            {
                return BadRequest(new ApiResponse<CardCreateResponse>{Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem")});
            }
        }

        [HttpGet]
        [Route("viewPinToken/{cardId}")]
        public async Task<IActionResult> ViewPin(string cardId)
        {
            try
            {
                var clientId = User.GetClientId();
                var result = await _visaCardClient.GetViewPinTokenAsync(clientId, cardId);

                return Ok(result);
            }
            catch
            {
                return BadRequest(new ApiResponse<SettingsResponse> { Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem") });
            }
        }

        [HttpPost]
        [Route("activate")]
        public async Task<IActionResult> ActivateCard([FromBody]ActivateCardRequest model)
        {
            try
            {
                var clientId = User.GetClientId();
                model.ClientId = clientId;

                var result = await _visaCardClient.ActivateCardAsync(model);

                return Ok(result);
            }
            catch
            {
                return BadRequest(new ApiResponse<SettingsResponse> { Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem") });
            }
        }

        [HttpPost]
        [Route("pay")]
        public async Task<IActionResult> PayCard([FromBody]string cardId)
        {
            try
            {
                var clientId = User.GetClientId();

                var result = await _visaCardClient.SendVisaPaymentAsync(new PaymentRequest{ClientId = clientId, CardId = cardId});

                return Ok(result);
            }
            catch
            {
                return BadRequest(new ApiResponse<SettingsResponse> { Error = new ErrorResponse(ValidationError.TechnicalProblem, "Technical problem") });
            }
        }
    }
}
