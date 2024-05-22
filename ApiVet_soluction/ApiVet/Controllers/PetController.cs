using ApiVet.Models;
using ApiVet.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ApiVet.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PetController : Controller
    {
        private ConexionDb conexionDb = new ConexionDb();

        [HttpGet("vet/{id}")]
        public IEnumerable<PetInfoDto> GetPetDpos(int id)
        {
            List<PetInfoDto> pets = new List<PetInfoDto>();

            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT PET.*, VET.*, RACE.*,MANAGER.* FROM PET
                                INNER JOIN VET ON PET.ID_VET = VET.ID_VET INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER WHERE PET.ID_VET = @id;";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using(MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            PetInfoDto pt = new PetInfoDto
                            {
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                VET_NAME = Convert.ToString(reader["NAME_VET"]),
                                IDENTIFICATION_PET = Convert.ToInt32(reader["IDENTIFICATION_PET"]),
                                RACE_NAME = Convert.ToString(reader["RACE"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                MANAGER_NAME = Convert.ToString(reader["FULLNAME"]),
                                MANAGER_PHONE = Convert.ToString(reader["PHONE_MANAGER"]),
                                COLOR = Convert.ToString(reader["COLOR"]),
                                SIZE = Convert.ToString(reader["SIZE"]),
                                AGE = Convert.ToString(reader["AGE"]),
                                WEIGHT = Convert.ToString(reader["WEIGHT"]),
                                STATE = Convert.ToString(reader["STATE"])

                                
                            };
                            pets.Add(pt);
                        }
                    }
                }
            }
            return pets;
        }


        [HttpGet("Manager/{id}")]
        public IEnumerable<PetInfoDto> GetPetDposManager(int id)
        {
            List<PetInfoDto> pets = new List<PetInfoDto>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT PET.*, VET.*, RACE.*,MANAGER.* FROM PET
                                INNER JOIN VET ON PET.ID_VET = VET.ID_VET INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER WHERE PET.ID_MANAGER= @id;";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            PetInfoDto pt = new PetInfoDto
                            {
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                VET_NAME = Convert.ToString(reader["NAME_VET"]),
                                IDENTIFICATION_PET = Convert.ToInt32(reader["IDENTIFICATION_PET"]),
                                RACE_NAME = Convert.ToString(reader["RACE"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                MANAGER_NAME = Convert.ToString(reader["FULLNAME"]),
                                MANAGER_PHONE = Convert.ToString(reader["PHONE_MANAGER"]),
                                COLOR = Convert.ToString(reader["COLOR"]),
                                SIZE = Convert.ToString(reader["SIZE"]),
                                AGE = Convert.ToString(reader["AGE"]),
                                WEIGHT = Convert.ToString(reader["WEIGHT"]),
                                STATE = Convert.ToString(reader["STATE"])


                            };
                            pets.Add(pt);
                        }
                    }
                }
            }
            return pets;
        }

        [HttpDelete("{id}")]

        public IActionResult DeleteVet(int id)
        {
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE PET SET STATE = IF (STATE = 'ACTIVO','INACTIVO','ACTIVO') WHERE ID_PET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if(filasAfectadas > 0)
                        {
                            return Ok();
                        }
                        else
                        {
                            return NotFound();
                        }

                    }catch (Exception ex)
                    {
                        return BadRequest("Error al eliminar " + ex.Message);
                    }
                }
            }
        }

        [HttpPost]
        public IActionResult InsertPet([FromBody] PetDpo pet)
        {
            if (pet == null)
            {
                return BadRequest("No null");
            }

            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"INSERT INTO PET(ID_VET,IDENTIFICATION_PET,NAME_PET,ID_MANAGER,ID_RACE,COLOR
                                  ,SIZE,AGE,WEIGHT,STATE) VALUES (@id_vet,@identification,@name,@id_manager,
                                   @id_race,@color,@size,@age,@weight,'ACTIVO')";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id_vet",pet.ID_VET);
                    comando.Parameters.AddWithValue("@identification",pet.IDENTIFICATION_PET);
                    comando.Parameters.AddWithValue("@name",pet.NAME_PET);
                    comando.Parameters.AddWithValue("@id_manager",pet.ID_MANAGER);
                    comando.Parameters.AddWithValue("@id_race",pet.ID_RACE);
                    comando.Parameters.AddWithValue("@color",pet.COLOR);
                    comando.Parameters.AddWithValue("@size",pet.SIZE);
                    comando.Parameters.AddWithValue("@age", pet.AGE);
                    comando.Parameters.AddWithValue("@weight",pet.WEIGHT);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            int nuevoId = (int)comando.LastInsertedId;
                            return Ok(new { Id = nuevoId, Message = "Pet insertada correctamente." });
                        }
                        else
                        {
                            return NotFound();
                        }
                    }catch (Exception ex)
                    {
                        return BadRequest("error al insertar " + ex.Message);
                    }
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult updatePet(int id, [FromBody] PetUpdate pet)
        {
            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"UPDATE PET SET IDENTIFICATION_PET = @identification,NAME_PET = @name,
                                    ID_MANAGER = @manager,SIZE = @size, AGE = @age,WEIGHT = @weight WHERE ID_PET = @id";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@identification", pet.IDENTIFICATION_PET);
                    comando.Parameters.AddWithValue("@name", pet.NAME_PET);
                    comando.Parameters.AddWithValue("@manager", pet.ID_MANAGER);
                    comando.Parameters.AddWithValue("@size", pet.SIZE);
                    comando.Parameters.AddWithValue("@age", pet.AGE);
                    comando.Parameters.AddWithValue("@weight", pet.WEIGHT);
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok(pet);

                        }
                        else
                        {
                            return NotFound();
                        }
                    }catch (Exception ex)
                    {
                        return BadRequest("Error al actualizar " + pet + " " + ex.Message);
                    }

                }
            }
        }

        [HttpGet("One/{id}")]
        public PetInfoDto GetPetDpo(int id)
        {
            PetInfoDto pet = null;

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT PET.*, VET.*, RACE.*,MANAGER.* FROM PET
                                INNER JOIN VET ON PET.ID_VET = VET.ID_VET INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER WHERE PET.ID_PET = @id;";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            pet = new PetInfoDto
                            {
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                VET_NAME = Convert.ToString(reader["NAME_VET"]),
                                IDENTIFICATION_PET = Convert.ToInt32(reader["IDENTIFICATION_PET"]),
                                RACE_NAME = Convert.ToString(reader["RACE"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                MANAGER_NAME = Convert.ToString(reader["FULLNAME"]),
                                MANAGER_PHONE = Convert.ToString(reader["PHONE_MANAGER"]),
                                COLOR = Convert.ToString(reader["COLOR"]),
                                SIZE = Convert.ToString(reader["SIZE"]),
                                AGE = Convert.ToString(reader["AGE"]),
                                WEIGHT = Convert.ToString(reader["WEIGHT"]),
                                STATE = Convert.ToString(reader["STATE"])


                            };
                            
                        }
                    }
                }
            }
            return pet;
        }
    }
}
