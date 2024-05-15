
using VetDpo = ApiVet.Models.Dto.VetDpo;

namespace ApiVet.Datos
{
    public static class VetStore
    {
        public static List<VetDpo> vetLits = new List<VetDpo>
        {
            new VetDpo{id=1,nombre="Holaaaa"},
            new VetDpo{id=2,nombre="jajajajaj"}
        };
    }
}
