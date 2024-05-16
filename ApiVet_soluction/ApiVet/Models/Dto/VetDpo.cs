using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class VetDpo
    {
        public int ID_VET { get; set; }

        [Required]
        public int IDENTIFICATION_ADMIN { get; set; }

        [Required]
        public string ADDRESS { get; set; }
        public decimal PROFITS { get; set; }
        public decimal LOSS { get; set; }
        public string STATE { get; set; }
    }
}
