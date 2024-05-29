using ApiVet.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : Controller
    {
        private ConexionDb conexionDb  = new ConexionDb();


        [HttpGet("vet/{id_vet}")]
        public IEnumerable<ManagerDpo> Get(int id_vet){
            List<ManagerDpo> managerDpos = new List<ManagerDpo>();
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM MANAGER WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id_vet);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ManagerDpo mana = new ManagerDpo
                            {
                                ID_MANAGER = Convert.ToInt32(reader["ID_MANAGER"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                            managerDpos.Add(mana);              
                        }
                    }                    
                }
            }
            return managerDpos;
        }


        [HttpGet("{id}")]
        public ManagerDpo GetManager(int id)
        {
            ManagerDpo managerDpo = null;

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM MANAGER WHERE ID_MANAGER = @id OR PHONE_MANAGER = @id";
                using (MySqlCommand  comando = new MySqlCommand( consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            managerDpo = new ManagerDpo
                            {
                                ID_MANAGER = Convert.ToInt32(reader["ID_MANAGER"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                        }
                    }
                }
            }
            return managerDpo;
        }


        [HttpPut("{id}")]
        public IActionResult UpdateManager(int id, [FromBody] ManagerUpdate manager)
        {
            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE MANAGER SET ADDRESS_MANAGER = @address_manager, PHONE_MANAGER = @phone,FULLNAME = @fullname WHERE ID_MANAGER = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@address_manager", manager.ADDRESS_MANAGER);
                    comando.Parameters.AddWithValue("@phone", manager.PHONE_MANAGER);
                    comando.Parameters.AddWithValue("@fullname", manager.FULLNAME);
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok(manager);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }catch (Exception ex) {
                        return BadRequest("No se actualizo " + manager +" "+ex.Message);
                    }
                }
            }
        }

        [HttpDelete("{id}")]

        public IActionResult DeleteManager(int id)
        {
            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE MANAGER SET STATE = IF(STATE = 'ACTIVO', 'INACTIVO', 'ACTIVO') WHERE ID_MANAGER = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if ( filasAfectadas > 0)
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
                        return BadRequest("Hubo un error al cambiar el estado " + ex.Message);
                    }
                }

            }
        }

        [HttpPost]
        public IActionResult InsertManager([FromBody] ManagerDpo manager)
        {
            if(manager == null)
            {
                return BadRequest("No se pueden enviar datos null");
            }

            using(MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"INSERT INTO MANAGER (ID_VET,ADDRESS_MANAGER,PHONE_MANAGER,FULLNAME,STATE)
                                    VALUES (@id,@address,@phone,@fullname,'ACTIVO')";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", manager.ID_VET);
                    comando.Parameters.AddWithValue("@address", manager.ADDRESS_MANAGER);
                    comando.Parameters.AddWithValue("@phone", manager.PHONE_MANAGER);
                    comando.Parameters.AddWithValue("@fullname", manager.FULLNAME);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            int nuevo = (int)comando.LastInsertedId;
                            return Ok(new {Id=nuevo,Message = "Manager creado con exito "});
                        }
                        else
                        {
                            return BadRequest("no se puedo insetar el Manager " +manager);
                        }
                    }catch(Exception ex)
                    {
                        return BadRequest("Error al insertar " + manager + " " + ex.Message);
                    }
                }
            }
        }


    }
}
