using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class VetDpo
    {
        public int ID_VET { get; set; }

        [Required]
        public int IDENTIFICATION_ADMIN { get; set; }

        [Required]
        public string NAME_VET { get; set; }

        [Required]
        public string ADDRESS { get; set; }
        public decimal PROFITS { get; set; }
        public decimal LOSS { get; set; }
        public string STATE { get; set; }
    }
    public class VetUpdate
    {
        [Required]
        public int IDENTIFICATION_ADMIN { get; set; }

        [Required]
        public string NAME_VET { get; set; }

        [Required]
        public string ADDRESS { get; set; }
    }

    public class VetInfoAdmin
    {
        public int ID_VET { get; set; }
        public string NAME_VET { get; set; }
        public string ADDRESS { get; set; }
        public decimal PROFITS { get; set; }
        public decimal LOSS { get; set; }
        public string STATE { get; set; }
        public string PHONE { get; set; }
        public string NAME { get; set; }
        public string LASTNAME { get; set; }
        public string EMAIL { get; set; }
    }
}
