using VetDpo = ApiVet.Models.Dto.VetDpo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ApiVet.Datos;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetController : ControllerBase
    {
        [HttpGet]

        public IEnumerable<VetDpo> GetVets() {
            return VetStore.vetLits;
        }


        [HttpGet("id")]
        public VetDpo GetVet(int id)
        {
            return VetStore.vetLits.FirstOrDefault(v=>v.id==id);

        }
    }
}
