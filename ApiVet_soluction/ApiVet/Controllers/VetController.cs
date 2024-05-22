using VetDpo = ApiVet.Models.Dto.VetDpo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using ApiVet.Models.Dto;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetController : ControllerBase
    {
        private ConexionDb MConexion = new ConexionDb();

        [HttpGet]
        public IEnumerable<VetDpo> GetVets()
        {
            List<VetDpo> vets = new List<VetDpo>();
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "SELECT * FROM VET WHERE STATE = 'ACTIVO'";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            VetDpo vet = new VetDpo
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                            vets.Add(vet);
                        }
                    }
                }
            }

            return vets;
        }


        [HttpGet("{id}")]
        public VetDpo GetVet(int id)
        {
            VetDpo vet = null;
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "SELECT * FROM VET WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            vet = new VetDpo
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                        }
                    }
                }
            }

            return vet;
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVet(int id, [FromBody] VetUpdate vetDpo)
        {
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "UPDATE VET SET  NAME_VET, ADDRESS = @address, WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@address", vetDpo.ADDRESS);
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();

                        if (filasAfectadas > 0)
                        {
                            return Ok();
                        }
                        else
                        {
                            return NotFound();
                        }

                    }catch (Exception ex)
                    {
                        return BadRequest("Algo salio mal en el update de vet. "+vetDpo);
                    }
                }
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteVet(int id)
        {
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "UPDATE VET SET STATE = IF(STATE = 'ACTIVO', 'INACTIVO', 'ACTIVO') WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok();
                        }
                        else
                        {
                            return NotFound();
                        }

                    }catch (Exception ex)
                    {
                        return BadRequest("hubo un error en la solicitud");
                    }
                }
            }
        }



        [HttpGet("admin/{id}")]
        public VetInfoAdmin GetVetAdminInfo(int id)
        {
            VetInfoAdmin info = null;

            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = @"SELECT v.*, u.* FROM VET v
                           INNER JOIN USER u ON u.ID_VET = V.ID_VET
                           WHERE v.ID_VET = @id";

                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);

                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            info = new VetInfoAdmin
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                PHONE = Convert.ToString(reader["PHONE"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                EMAIL = Convert.ToString(reader["EMAIL"]),
                            };

                        }
                    }
                    conexion.Close();
                }
            }

            return info;
        }




        [HttpPost]
        public IActionResult InsertVet([FromBody] VetDpo vet)
        {
            if (vet == null)
            {
                return BadRequest("El objeto VetDpo recibido es nulo. "+vet);
            }
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = @"INSERT INTO VET (NAME_VET, ADDRESS, STATE) 
                            VALUES ( @name ,@address,'ACTIVO')";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@name", vet.NAME_VET);
                    comando.Parameters.AddWithValue("@address", vet.ADDRESS);
                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            int nuevoId = (int)comando.LastInsertedId;
                            return Ok(new { Id = nuevoId, Message = "Veterinaria insertada correctamente." });
                        }
                        else
                        {
                            return BadRequest("No se pudo insertar la veterinaria.");
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error al insetar Vet. "+ex.Message);

                    } 
                }
            }
        }
    }
}
