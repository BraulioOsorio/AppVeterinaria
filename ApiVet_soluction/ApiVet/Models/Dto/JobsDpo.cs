using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class JobsDpo
    {
        public int ID_JOBS { get; set; }

        [Required]
        public int ID_VET { get; set; }

        [Required]
        public int ID_USER { get; set; }

        [Required]
        public int IDENTIFICATION_PET { get; set; }

        [Required]
        public string JOB { get; set; }

        [Required]
        public decimal COSTS { get; set; }

        [Required]
        public string COST_DESCRIPTION { get; set; }

        public string STATE { get; set; }
    }

    public class JobsUpdate
    {
        [Required]
        public int ID_USER { get; set; }

        [Required]
        public int IDENTIFICATION_PET { get; set; }

        [Required]
        public string JOB { get; set; }

        [Required]
        public decimal COSTS { get; set; }

        [Required]
        public string COST_DESCRIPTION { get; set; }
    }

    public class JobsInfo
    {
        public int ID_JOBS { get; set; }
        public string JOB { get; set; }
        public decimal COSTS { get; set; }
        public string COST_DESCRIPTION { get; set; }
        public string STATE { get; set; }
        public string NAME_PET { get; set; }
        public string FULLNAME { get; set; }
        public string ADDRESS_MANAGER { get; set; }
        public string PHONE_MANAGER { get; set; }
        public string RACE { get; set;}
        public string NAME_VET { get; set;}
        public string ADDRESS { get; set;}
    }
}
