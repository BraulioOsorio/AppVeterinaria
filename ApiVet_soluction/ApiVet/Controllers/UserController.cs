using ApiVet.Models.Dto;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Globalization;

namespace ApiVet.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {

        private ConexionDb conexionDb = new ConexionDb();

        [HttpGet]
        public IEnumerable<Admindpo> GetUsers()
        {
            List<Admindpo> users = new List<Admindpo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM USER";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    using(MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while ( reader.Read())
                        {
                            Admindpo ad = new Admindpo
                            {
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                IDENTIFICATION = Convert.ToString(reader["IDENTIFICATION"]),
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                PHONE = Convert.ToString(reader["PHONE"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                EMAIL = Convert.ToString(reader["EMAIL"]),
                                CARGO = Convert.ToString(reader["CARGO"]),
                                STATE = Convert.ToString(reader["STATE"])

                            };
                            users.Add(ad);
                        }
                    }
                }
            }
            return users;
            
        }

        [HttpGet("{id}/{idvet}")]
        public Admindpo GetUser(int id,int idvet)
        {
            Admindpo user = null;

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM USER WHERE ID_USER = @id OR IDENTIFICATION = @id AND ID_VET = @id_vet";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion)) {

                    comando.Parameters.AddWithValue("@id_vet", idvet);
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            user = new Admindpo
                            {
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                IDENTIFICATION = Convert.ToString(reader["IDENTIFICATION"]),
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                PHONE = Convert.ToString(reader["PHONE"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                EMAIL = Convert.ToString(reader["EMAIL"]),
                                CARGO = Convert.ToString(reader["CARGO"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                        }
                    }

                }
            }
            return user;  
        }


        [HttpGet("vet/{id}")]
        public IEnumerable<Admindpo> GetUservet(int id)
        {
            List<Admindpo> users = new List<Admindpo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "SELECT * FROM USER WHERE ID_VET = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {

                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Admindpo user = new Admindpo
                            {
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                IDENTIFICATION = Convert.ToString(reader["IDENTIFICATION"]),
                                ID_VET = Convert.ToInt32(reader["ID_VET"]),
                                PHONE = Convert.ToString(reader["PHONE"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                EMAIL = Convert.ToString(reader["EMAIL"]),
                                CARGO = Convert.ToString(reader["CARGO"]),
                                STATE = Convert.ToString(reader["STATE"])
                            };
                            users.Add(user);
                        }
                    }

                }
            }
            return users;
        }


        [HttpPut("{id}")]

        public IActionResult updateUser(int id, [FromBody] UserUpdate user) 
        {
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE USER SET PHONE = @phone, NAME = @name, LASTNAME = @lastname, EMAIL = @email WHERE ID_USER = @id";
                using(MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@phone", user.PHONE);
                    comando.Parameters.AddWithValue("@name", user.NAME);
                    comando.Parameters.AddWithValue("@lastname", user.LASTNAME);
                    comando.Parameters.AddWithValue("@email", user.EMAIL);
                    comando.Parameters.AddWithValue("@id", id);

                    try {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok(user);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }catch (Exception ex)
                    {
                        return BadRequest("algo salio mal en el update "+user+" "+ex.Message);
                    }
                }
            }
        
        }

        [HttpDelete("{id}")]

        public IActionResult deleteUser(int id) 
        {
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE USER SET STATE = IF(STATE = 'ACTIVO','INACTIVO','ACTIVO') WHERE ID_USER = @id";
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
                    }catch (Exception ex) { 
                        return BadRequest("Error al eliminar"+ex.Message);
                    }
                }
                    
            }            
        
        }


        [HttpPost]

        public IActionResult InsertUser([FromBody] Admindpo user)
        {
            if (user == null)
            {
                return BadRequest("No puede enviarlo null" + user);
            }

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"INSERT INTO USER (IDENTIFICATION,ID_VET,PHONE,NAME,LASTNAME,EMAIL,PASS,CARGO,STATE)
                                    VALUES (@identification,@id_vet,@phone,@name,@lastname,@email,@pass,@cargo,'ACTIVO') ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    string passHas = BCrypt.Net.BCrypt.HashPassword(user.PASS);
                    comando.Parameters.AddWithValue("@identification", user.IDENTIFICATION);
                    comando.Parameters.AddWithValue("@id_vet", user.ID_VET);
                    comando.Parameters.AddWithValue("@phone", user.PHONE);
                    comando.Parameters.AddWithValue("@name", user.NAME);
                    comando.Parameters.AddWithValue("@lastname", user.LASTNAME);
                    comando.Parameters.AddWithValue("@email", user.EMAIL);
                    comando.Parameters.AddWithValue("@pass", passHas);
                    comando.Parameters.AddWithValue("@cargo", user.CARGO);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0){
                            int nuevo = (int)comando.LastInsertedId;
                            return Ok(new { Id = nuevo,message = "Usuario Creado con exito" });
                        }
                        else
                        {
                            return NotFound();
                        }
                    }catch (Exception ex) { 
                        return BadRequest("Error al crear"+ex.Message);
                    }
                }
            }
        }


        [HttpPost("/Login")]
        public IActionResult Login([FromBody] login login)
        {
            if (login == null)
            {
                return BadRequest("No puede enviarlo null" + login);
            }
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @" SELECT * FROM USER WHERE EMAIL = @email ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@email", login.EMAIL);
                    try
                    {
                        using (MySqlDataReader reader = comando.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string pass = reader["PASS"].ToString();
                                bool verifity = BCrypt.Net.BCrypt.Verify(login.PASS, pass);
                                if (verifity)
                                {
                                    return Ok(verifity);
                                }
                                else
                                {
                                    return BadRequest(false);
                                }
                            }
                            else
                            {
                                return BadRequest("El correo no se encuentra registrado");
                            }
                        }   
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error al crear" + ex.Message);
                    }
                }
            }
        }



    }
}
