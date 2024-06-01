using ApiVet.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ApiVet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : Controller
    {
        private ConexionDb conexionDb = new ConexionDb();

        [HttpGet("TheVet/{id}")]
        public IEnumerable<JobsInfo> Get(int id)
        {
            List<JobsInfo> Jobs = new List<JobsInfo>();
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT JOBS.*,PET.*,MANAGER.*,RACE.*,VET.*,USER.* FROM JOBS
                                    INNER JOIN PET ON JOBS.IDENTIFICATION_PET = PET.ID_PET
                                    INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER
                                    INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                    INNER JOIN USER ON JOBS.ID_USER = USER.ID_USER
                                    INNER JOIN VET ON PET.ID_VET = VET.ID_VET  WHERE JOBS.ID_VET = @id ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            JobsInfo job = new JobsInfo
                            {
                                ID_JOBS = Convert.ToInt32(reader["ID_JOBS"]),
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                JOB = Convert.ToString(reader["JOB"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                COSTS = Convert.ToDecimal(reader["COSTS"]),
                                COST_DESCRIPTION = Convert.ToString(reader["COST_DESCRIPTION"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                STATE_MONEY = Convert.ToString(reader["STATE_MONEY"]),
                            };
                            Jobs.Add(job);
                        }
                    }
                }
            }
            return Jobs;
        }

        [HttpDelete("{id}")]

        public IActionResult DeleteJob(int id)
        {
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = "UPDATE JOBS SET STATE = IF (STATE = 'ACTIVO','FINALIZADO','ACTIVO') WHERE ID_JOBS = @id";
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

                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error al eliminar " + ex.Message);
                    }
                }
            }
        }


        [HttpPost]
        public IActionResult InsertJob([FromBody] JobsDpo job)
        {
            if (job == null)
            {
                return BadRequest("No null");
            }

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"INSERT INTO JOBS (ID_VET, ID_USER, IDENTIFICATION_PET, JOB, COSTS, COST_DESCRIPTION, STATE,STATE_MONEY)
                                   VALUES (@id_vet, @id_user, @id_pet, @job, @costs,@cost_des, 'ACTIVO',@money);";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id_user", job.ID_USER);
                    comando.Parameters.AddWithValue("@id_vet", job.ID_VET);
                    comando.Parameters.AddWithValue("@id_pet", job.IDENTIFICATION_PET);
                    comando.Parameters.AddWithValue("@job", job.JOB);
                    comando.Parameters.AddWithValue("@costs", job.COSTS);
                    comando.Parameters.AddWithValue("@cost_des", job.COST_DESCRIPTION);
                    comando.Parameters.AddWithValue("@money", job.STATE_MONEY);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            int nuevoId = (int)comando.LastInsertedId;
                            return Ok(new { Id = nuevoId, Message = "Job insertado correctamente." });
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("error al insertar " + ex.Message);
                    }
                }
            }
        }


        [HttpPut("{id}")]
        public IActionResult updateJobs(int id, [FromBody] JobsUpdate job)
        {
            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"UPDATE JOBS SET ID_USER = @id_user,IDENTIFICATION_PET = @id_pet,
                                    JOB = @job,COSTS = @costs, COST_DESCRIPTION = @cost_des,STATE_MONEY = @money WHERE ID_JOBS = @id";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id_user", job.ID_USER);
                    comando.Parameters.AddWithValue("@id_pet", job.IDENTIFICATION_PET);
                    comando.Parameters.AddWithValue("@job", job.JOB);
                    comando.Parameters.AddWithValue("@costs", job.COSTS);
                    comando.Parameters.AddWithValue("@cost_des", job.COST_DESCRIPTION);
                    comando.Parameters.AddWithValue("@money", job.STATE_MONEY);
                    comando.Parameters.AddWithValue("@id", id);

                    try
                    {
                        int filasAfectadas = comando.ExecuteNonQuery();
                        if (filasAfectadas > 0)
                        {
                            return Ok(job);

                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error al actualizar " + job + " " + ex.Message);
                    }

                }
            }
        }

        [HttpGet("ThePet/{id}")]
        public IEnumerable<JobsInfo> GetJobDpo(int id)
        {
            List<JobsInfo> job = new List<JobsInfo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT JOBS.*,PET.*,MANAGER.*,RACE.*,VET.*,USER.* FROM JOBS
                                    INNER JOIN PET ON JOBS.IDENTIFICATION_PET = PET.ID_PET
                                    INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER
                                    INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                    INNER JOIN USER ON JOBS.ID_USER = USER.ID_USER
                                    INNER JOIN VET ON PET.ID_VET = VET.ID_VET  WHERE PET.ID_PET = @id ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            JobsInfo jobs = new JobsInfo
                            {
                                ID_JOBS = Convert.ToInt32(reader["ID_JOBS"]),
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                JOB = Convert.ToString(reader["JOB"]),
                                COSTS = Convert.ToDecimal(reader["COSTS"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                COST_DESCRIPTION = Convert.ToString(reader["COST_DESCRIPTION"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                STATE_MONEY = Convert.ToString(reader["STATE_MONEY"])
                            };
                            job.Add(jobs);
                        }
                    }
                }
            }
            return job;
        }

        [HttpGet("OneJob/{id}")]
        public JobsInfo GetJobDpos(int id)
        {
            JobsInfo job = null;

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT JOBS.*,PET.*,MANAGER.*,RACE.*,VET.*,USER.* FROM JOBS
                                    INNER JOIN PET ON JOBS.IDENTIFICATION_PET = PET.ID_PET
                                    INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER
                                    INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                    INNER JOIN USER ON JOBS.ID_USER = USER.ID_USER
                                    INNER JOIN VET ON PET.ID_VET = VET.ID_VET  WHERE JOBS.ID_JOBS = @id ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            job = new JobsInfo
                            {
                                ID_JOBS = Convert.ToInt32(reader["ID_JOBS"]),
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                JOB = Convert.ToString(reader["JOB"]),
                                COSTS = Convert.ToDecimal(reader["COSTS"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                COST_DESCRIPTION = Convert.ToString(reader["COST_DESCRIPTION"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                STATE_MONEY = Convert.ToString(reader["STATE_MONEY"])
                            };

                        }
                    }
                }
            }
            return job;
        }


        [HttpGet("Status/{id}/{state}")]
        public IEnumerable<JobsInfo> GetJobFinal(int id,string state)
        {
            List<JobsInfo> job = new List<JobsInfo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT JOBS.*,PET.*,MANAGER.*,RACE.*,VET.*,USER.* FROM JOBS
                                    INNER JOIN PET ON JOBS.IDENTIFICATION_PET = PET.ID_PET
                                    INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER
                                    INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                    INNER JOIN USER ON JOBS.ID_USER = USER.ID_USER
                                    INNER JOIN VET ON PET.ID_VET = VET.ID_VET  WHERE JOBS.ID_VET = @id AND JOBS.STATE = @state ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    comando.Parameters.AddWithValue("@state", state);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            JobsInfo jobs = new JobsInfo
                            {
                                ID_JOBS = Convert.ToInt32(reader["ID_JOBS"]),
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                JOB = Convert.ToString(reader["JOB"]),
                                COSTS = Convert.ToDecimal(reader["COSTS"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                COST_DESCRIPTION = Convert.ToString(reader["COST_DESCRIPTION"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                STATE_MONEY = Convert.ToString(reader["STATE_MONEY"])
                            };
                            job.Add(jobs);
                        }
                    }
                }
            }
            return job;
        }

        [HttpGet("StatusMoney/{id}/{state}")]
        public IEnumerable<JobsInfo> GetJobMoney(int id, string state)
        {
            List<JobsInfo> job = new List<JobsInfo>();

            using (MySqlConnection conexion = conexionDb.GetConexionDb())
            {
                string consulta = @"SELECT JOBS.*,PET.*,MANAGER.*,RACE.*,VET.*,USER.* FROM JOBS
                                    INNER JOIN PET ON JOBS.IDENTIFICATION_PET = PET.ID_PET
                                    INNER JOIN MANAGER ON PET.ID_MANAGER = MANAGER.ID_MANAGER
                                    INNER JOIN RACE ON PET.ID_RACE = RACE.ID_RACE
                                    INNER JOIN USER ON JOBS.ID_USER = USER.ID_USER
                                    INNER JOIN VET ON PET.ID_VET = VET.ID_VET  WHERE JOBS.ID_VET = @id AND JOBS.STATE_MONEY = @state ";
                using (MySqlCommand comando = new MySqlCommand(consulta, conexion))
                {
                    comando.Parameters.AddWithValue("@id", id);
                    comando.Parameters.AddWithValue("@state", state);
                    using (MySqlDataReader reader = comando.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            JobsInfo jobs = new JobsInfo
                            {
                                ID_JOBS = Convert.ToInt32(reader["ID_JOBS"]),
                                ID_USER = Convert.ToInt32(reader["ID_USER"]),
                                ID_PET = Convert.ToInt32(reader["ID_PET"]),
                                JOB = Convert.ToString(reader["JOB"]),
                                COSTS = Convert.ToDecimal(reader["COSTS"]),
                                NAME = Convert.ToString(reader["NAME"]),
                                LASTNAME = Convert.ToString(reader["LASTNAME"]),
                                COST_DESCRIPTION = Convert.ToString(reader["COST_DESCRIPTION"]),
                                NAME_PET = Convert.ToString(reader["NAME_PET"]),
                                FULLNAME = Convert.ToString(reader["FULLNAME"]),
                                ADDRESS_MANAGER = Convert.ToString(reader["ADDRESS_MANAGER"]),
                                PHONE_MANAGER = Convert.ToString(reader["PHONE_MANAGER"]),
                                RACE = Convert.ToString(reader["RACE"]),
                                NAME_VET = Convert.ToString(reader["NAME_VET"]),
                                ADDRESS = Convert.ToString(reader["ADDRESS"]),
                                STATE = Convert.ToString(reader["STATE"]),
                                STATE_MONEY = Convert.ToString(reader["STATE_MONEY"])
                            };
                            job.Add(jobs);
                        }
                    }
                }
            }
            return job;
        }



    }
}
