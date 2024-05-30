using Org.BouncyCastle.Asn1.Cmp;
using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class ManagerDpo
    {
        public int ID_MANAGER { get; set; }

        [Required]
        public int ID_VET{ get; set; }

        [Required]
        [MaxLength(200)]
        public string ADDRESS_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        [MinLength(8, ErrorMessage = "Verifique el telefono")]
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
        [MinLength(8,ErrorMessage ="Verifique el telefono")]
        
        public string PHONE_MANAGER { get; set; }

        [Required]
        [MaxLength(200)]
        public string FULLNAME { get; set; }

    }
}
