using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace ApiVet.Models.Dto
{
    public class Admindpo
    {
        public int ID_USER { get; set;}

        [Required]
        [MaxLength(20)]
        public string IDENTIFICATION { get; set; }

        [Required]
        public int ID_VET { get; set; }

        public string PHONE { get; set; }

        [Required]
        [MaxLength(100)]
        public string NAME { get; set; }

        [Required]
        [MaxLength(100)]
        public string LASTNAME { get; set; }

        [Required]
        [EmailAddress]
        public string EMAIL { get; set; }

        [Required]
        [MaxLength(200)]
        public string PASS { get; set; }

        [Required]
        public string CARGO { get; set; }

        public string STATE { get; set; }
    }

    public class UserUpdate
    {

        [Required]
        [MaxLength(20)]
        public string PHONE { get; set; }

        [Required]
        [MaxLength(100)]
        public string NAME { get; set; }

        [Required]
        [MaxLength(100)]
        public string LASTNAME { get; set; }

        [Required]
        [EmailAddress]
        public string EMAIL { get; set; }

    }
    public class login
    {
        [EmailAddress]
        [Required]
        public string EMAIL { get; set; }

        [Required]
        public string PASS { get; set; }

    }
}
