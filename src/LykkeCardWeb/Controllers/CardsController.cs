using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Log;
using Lykke.Service.Visa.Client;
using Lykke.Service.Visa.Client.AutorestClient.Models;
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
        private readonly ILog _log;

        public CardsController(
            IVisaCardClient visaCardClient,
            ILog log)
        {
            _visaCardClient = visaCardClient;
            _log = log;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetCards()
        {
            string clientId = User.GetClientId();

            try
            {
                IEnumerable<VisaCard> cards = await _visaCardClient.GetClientCardsAsync(clientId);
                return Ok(cards.OrderByDescending(item => item.CreationDate));
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(GetCards), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(GetCards), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("settings")]
        public async Task<IActionResult> GetSettings()
        {
            string clientId = User.GetClientId();

            try
            {
                SettingsResponse settings = await _visaCardClient.GetSettingsAndValidateAsync(clientId);
                return Ok(settings);
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(GetSettings), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(GetSettings), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("createRequest")]
        public async Task<IActionResult> CreateCardRequest([FromBody]CreateCardRequestModel model)
        {
            string clientId = User.GetClientId();

            try
            {
                model.ClientId = clientId;
                CardRequestResponse result = await _visaCardClient.CardRequestAsync(model);
                return Ok(result);
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(CreateCardRequest), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(CreateCardRequest), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("viewPinToken/{cardId}")]
        public async Task<IActionResult> ViewPin(string cardId)
        {
            string clientId = User.GetClientId();

            try
            {
                string token = await _visaCardClient.GetViewPinTokenAsync(clientId, cardId);
                return Ok(token);
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(ViewPin), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(ViewPin), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("activate")]
        public async Task<IActionResult> ActivateCard([FromBody]ActivateCardRequest model)
        {
            string clientId = User.GetClientId();

            try
            {
                model.ClientId = clientId;
                bool result = await _visaCardClient.ActivateCardAsync(model);
                return Ok(result);
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(ActivateCard), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(ActivateCard), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("pay")]
        public async Task<IActionResult> PayCard([FromBody]string cardId)
        {
            string clientId = User.GetClientId();

            try
            {
                string result = await _visaCardClient.SendVisaPaymentAsync(new PaymentRequest{ClientId = clientId, CardId = cardId});
                return Ok(result);
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(PayCard), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(PayCard), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("block")]
        public async Task<IActionResult> BlockCard([FromBody]string cardId)
        {
            string clientId = User.GetClientId();

            try
            {
                VisaCard cardResult = await _visaCardClient.GetClientCardAsync(clientId, cardId);

                if (cardResult.Status == CardStatus.Activated || cardResult.Status == CardStatus.Blocked)
                {
                    var result = await _visaCardClient.UpdateCardStatusAsync(new UpdateCardStatusModel
                    {
                        ClientId = clientId,
                        CardId = cardId,
                        Status = cardResult.Status == CardStatus.Activated ? CardStatus.Blocked : CardStatus.Activated
                    });

                    return Ok(new {result = result});
                }

                return Ok(new { result = false });
            }
            catch (VisaServiceException vex)
            {
                if (vex.Code == ValidationError.TechnicalProblem)
                    await _log.WriteErrorAsync(nameof(CardsController), nameof(BlockCard), clientId, vex);
                return BadRequest(new { code = vex.Code, message = vex.Message });
            }
            catch (Exception ex)
            {
                await _log.WriteErrorAsync(nameof(CardsController), nameof(BlockCard), clientId, ex);
                return BadRequest(new { code = ValidationError.TechnicalProblem, message = ex.Message });
            }
        }
    }
}
