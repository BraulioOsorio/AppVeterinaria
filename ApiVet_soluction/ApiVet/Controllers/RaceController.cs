using ApiVet.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RaceController : Controller
    {
        private ConexionDb conexionDb = new ConexionDb();

        [HttpGet]

        public IEnumerable<RaceDpo> GetRaces()
        {
            List<RaceDpo> races = new List<RaceDpo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM RACE";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            RaceDpo race = new RaceDpo
                            {
                                ID_RACE = Convert.ToInt32(reader["ID_RACE"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                            races.Add(race);
                        }
                    }
                }
            }
            return races;
        }


        [HttpGet("{id}")]

        public RaceDpo GetRace(int id)
        {
            RaceDpo race = null;
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM RACE WHERE ID_RACE = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion)) {

                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            race = new RaceDpo
                            {
                                ID_RACE = Convert.ToInt32(reader["ID_RACE"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                        }
                    }
                
                }
            }
            return race;
        }

        [HttpPut("{id}")]

        public IActionResult UpdateRace(int id ,[FromBody] RaceUpdate raceU) {
        
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE RACE SET RACE = @race,ID_VET = @vet WHERE ID_RACE = @id";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@race", raceU.RACE);
                    comando.Parameters.AddWithValue("@vet", raceU.ID_VET);
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok(raceU);

                        }
                        else
                        {
                            return NotFound("Error Casi Actualizado");
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("error al actualizar " + raceU +" "+ex.Message);
                    }
                }
            }
        }

        [HttpDelete("{id}")]

        public IActionResult DeleteRace(int id)
        {
            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE RACE SET STATE = IF(STATE ='ACTIVO','INACTIVO','ACTIVO') WHERE ID_RACE = @id";
                
                using (MySqlCommand comando = new MySqlCommand( consulta, conexion))
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
                    }
                    catch (Exception ex) 
                    {
                        return BadRequest("error al actualizar el estado "+ex.Message);
                    }
                }
            }
        }


        [HttpPost]
        public IActionResult InserRacer([FromBody] RaceDpo race)
        {
            if (race == null)
            {
                return BadRequest("No se aceptas valores nullos");
            }
            using ( MySqlConnection conexion = conexionDb.GetConexionDb() )
            {
                string consulta = @"INSERT INTO RACE (RACE,ID_VET,STATE) VALUES
                                     (@race, @id_vet,'ACTIVO')";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@race", race.RACE);
                    comando.Parameters.AddWithValue("@id_vet", race.ID_VET);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();

                        if (filasAfectadas > 0)
                        {
                            int nuevo = (int)comando.LastInsertedId;
                            return Ok(new { id = nuevo, Message = "Rasa insertada" });
                        }
                        else
                        {
                            return NotFound("No se pudo insertar");
                        }

                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error al intertar "+ex.Message);
                    }
                }
            }
        }

    }
}
