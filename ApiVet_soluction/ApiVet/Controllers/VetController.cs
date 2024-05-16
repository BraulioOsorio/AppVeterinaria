using VetDpo = ApiVet.Models.Dto.VetDpo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using ApiVet.Models.Dto;
using ApiVet.Models;

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

            // Crear la conexión y la consulta SQL
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "SELECT * FROM VET WHERE STATE = 'ACTIVO'";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    // Ejecutar la consulta y leer los resultados
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Crear un objeto VetDpo y asignar valores a sus propiedades
                            VetDpo vet = new VetDpo
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                IDENTIFICATION_ADMIN = Convert.ToInt32(reader["IDENTIFICATION_ADMIN"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                PROFITS = Convert.ToDecimal(reader["PROFITS"]),
                                LOSS = Convert.ToDecimal(reader["LOSS"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };

                            // Agregar el objeto VetDpo a la lista
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

            // Crear la conexión y la consulta SQL con un parámetro
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "SELECT * FROM VET WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);

                    // Ejecutar la consulta y leer el resultado
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Leer los valores de las columnas y crear un objeto VetDpo
                            vet = new VetDpo
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                IDENTIFICATION_ADMIN = Convert.ToInt32(reader["IDENTIFICATION_ADMIN"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                PROFITS = Convert.ToDecimal(reader["PROFITS"]),
                                LOSS = Convert.ToDecimal(reader["LOSS"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                        }
                    }
                }
            }

            return vet;
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVet(int id, [FromBody] VetDpo vetDpo)
        {
            // Crear la conexión y la consulta SQL con un parámetro
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = "UPDATE VET SET IDENTIFICATION_ADMIN = @identificationAdmin, ADDRESS = @address, PROFITS = @profits, LOSS = @loss WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    // Establecer los parámetros de la consulta SQL
                    comando.Parameters.AddWithValue("@identificationAdmin", vetDpo.IDENTIFICATION_ADMIN);
                    comando.Parameters.AddWithValue("@address", vetDpo.ADDRESS);
                    comando.Parameters.AddWithValue("@profits", vetDpo.PROFITS);
                    comando.Parameters.AddWithValue("@loss", vetDpo.LOSS);
                    comando.Parameters.AddWithValue("@id", id);

                    // Ejecutar la consulta
                    int filasAfectadas = comando.ExecuteNonQuery();

                    // Verificar si se actualizó correctamente
                    if (filasAfectadas > 0)
                    {
                        return Ok(); // Devolver 200 OK si la actualización fue exitosa
                    }
                    else
                    {
                        return NotFound(); // Devolver 404 Not Found si no se encontró el registro
                    }
                }
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteVet(int id)
        {
            // Crear la conexión y la consulta SQL con un parámetro
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                // Actualizar el estado del registro
                string consulta = "UPDATE VET SET STATE = IF(STATE = 'ACTIVO', 'INACTIVO', 'ACTIVO') WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    // Establecer el parámetro de la consulta SQL
                    comando.Parameters.AddWithValue("@id", id);
                    // Ejecutar la consulta
                    int filasAfectadas = comando.ExecuteNonQuery();

                    // Verificar si se actualizó correctamente
                    if (filasAfectadas > 0)
                    {
                        return Ok(); // Devolver 200 OK si la actualización fue exitosa
                    }
                    else
                    {
                        return NotFound(); // Devolver 404 Not Found si no se encontró el registro
                    }
                }
            }
        }



        [HttpGet("admin/{id}")]
        public VetAdminInfo GetVetAdminInfo(int id)
        {
            VetAdminInfo vetAdminInfo = null;

            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = @"SELECT v.ID_VET, v.IDENTIFICATION_ADMIN, v.ADDRESS, v.PROFITS, v.LOSS, v.STATE,
                                  u.NAME AS ADMIN_NAME, u.EMAIL AS ADMIN_EMAIL
                           FROM VET v
                           INNER JOIN USER u ON v.IDENTIFICATION_ADMIN = u.ID_USER
                           WHERE v.ID_VET = @id";

                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);

                    

                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            VetDpo vet = new VetDpo
                            {
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                IDENTIFICATION_ADMIN = Convert.ToInt32(reader["IDENTIFICATION_ADMIN"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                PROFITS = Convert.ToDecimal(reader["PROFITS"]),
                                LOSS = Convert.ToDecimal(reader["LOSS"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };

                            Admindpo admin = new Admindpo
                            {
                                ID_ADMIN = vet.IDENTIFICATION_ADMIN,
                                NAME = Convert.ToString(reader["ADMIN_NAME"]),
                                EMAIL = Convert.ToString(reader["ADMIN_EMAIL"])
                            };

                            vetAdminInfo = new VetAdminInfo
                            {
                                Vet = vet,
                                Admin = admin
                            };
                        }
                    }

                    // Cierra la conexión después de usarla
                    conexion.Close();
                }
            }

            return vetAdminInfo;
        }




        [HttpPost]
        public IActionResult InsertVet([FromBody] VetDpo vet)
        {
            // Validar el objeto vet recibido
            if (vet == null)
            {
                return BadRequest("El objeto VetDpo recibido es nulo.");
            }

            // Crear la conexión y la consulta SQL con parámetros
            using (MySqlConnection conexion = MConexion.GetConexionDb())
            {
                string consulta = @"INSERT INTO VET (IDENTIFICATION_ADMIN, ADDRESS, PROFITS, LOSS, STATE) 
                            VALUES (@identificationAdmin, @address, @profits, @loss,'ACTIVO')";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    // Establecer los parámetros de la consulta SQL
                    comando.Parameters.AddWithValue("@identificationAdmin", vet.IDENTIFICATION_ADMIN);
                    comando.Parameters.AddWithValue("@address", vet.ADDRESS);
                    comando.Parameters.AddWithValue("@profits", vet.PROFITS);
                    comando.Parameters.AddWithValue("@loss", vet.LOSS);
                    // Ejecutar la consulta
                    int filasAfectadas = comando.ExecuteNonQuery();

                    // Verificar si se insertó correctamente
                    if (filasAfectadas > 0)
                    {
                        // Obtener el ID generado para la nueva veterinaria
                        int nuevoId = (int)comando.LastInsertedId;

                        // Devolver el ID generado y un mensaje de éxito
                        return Ok(new { Id = nuevoId, Message = "Veterinaria insertada correctamente." });
                    }
                    else
                    {
                        return BadRequest("No se pudo insertar la veterinaria.");
                    }
                }
            }
        }






    }
}
