using System.ComponentModel.DataAnnotations;

namespace ApiVet.Models.Dto
{
    public class PetDpo
    {

        public int ID_PET { get; set; }

        [Required]
        public int ID_VET { get; set; }

        [Required]
        public int IDENTIFICATION_PET { get;set; }

        [Required,MaxLength(255)]
        public string NAME_PET { get; set; }

        [Required]
        public int ID_MANAGER { get; set; }

        [Required]
        public int ID_RACE { get; set; }

        [Required,MaxLength(90)]
        public string COLOR { get; set; }

        [Required,MaxLength(90)]
        public string SIZE { get; set; }

        [Required,MaxLength(90)]
        public string AGE { get; set; }

        [Required,MaxLength(90)]
        public string WEIGHT { get; set; }

        public string STATE { get; set; }
    }

    public class PetUpdate
    {

        [Required]
        public int IDENTIFICATION_PET { get; set; }

        [Required, MaxLength(255)]
        public string NAME_PET { get; set; }

        [Required]
        public int ID_MANAGER { get; set; }


        [Required, MaxLength(90)]
        public string SIZE { get; set; }

        [Required, MaxLength(90)]
        public string AGE { get; set; }

        [Required, MaxLength(90)]
        public string WEIGHT { get; set; }
    }
    public class PetInfoDto
    {
        public int ID_PET { get; set; }
        public int IDENTIFICATION_PET { get; set; }
        public string NAME_PET { get; set; }
        public string VET_NAME { get; set; }
        public string RACE_NAME { get; set; }
        public string MANAGER_NAME { get; set; }
        public string MANAGER_PHONE { get; set; }
        public int ID_MANAGER { get; set; }
        public string COLOR { get; set; }
        public string SIZE { get; set; }
        public string AGE { get; set; }
        public string WEIGHT { get; set; }
        public string STATE { get; set; }
    }

}
