using ApiVet.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetController : ControllerBase
    {
        [HttpGet]

        public IEnumerable<Vet> GetVets() {
            return new List<Vet>
            {
                new Vet{id=1,nombre="Probando"},
                new Vet{id=2,nombre="Vista a la playa"}
            };
        }
    }
}
