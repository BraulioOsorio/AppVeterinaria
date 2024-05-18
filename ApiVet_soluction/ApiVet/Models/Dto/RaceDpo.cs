using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class RaceDpo
    {

        public int ID_RACE { get; set; }

        [Required]
        [MaxLength(100)]    
        public string RACE { get; set; }

        [Required]
        public int ID_VET { get; set; }

        public string STATE { get; set; }
    }

    public class RaceUpdate()
    {
        [Required]
        [MaxLength(100)]
        public string RACE { get; set; }

        [Required]
        public int ID_VET { get; set; }

    }
}
