using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class ManagerDpo
    {
        public int ID_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string ADDRESS_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string PHONE_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string FULLNAME { get; set; }

        public string STATE { get; set; }
        
    }

    public class ManagerUpdate 
    {
        [Required]
        [MaxLength(200)]
        public string ADDRESS_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string PHONE_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string FULLNAME { get; set; }

    }
}
