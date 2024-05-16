using MySql.Data.MySqlClient;

namespace ApiVet
{
    public class ConexionDb
    {
        private MySqlConnection conexion;
        private string server = "localhost";
        private string database = "veterinaria";
        private string user = "root";
        private string password = "";
        private string cadenaConexion;

        public ConexionDb()
        {
            cadenaConexion = "Database=" + database +
                "; DataSource=" + server +
                "; User Id=" + user +
                "; Password=" + password;
        }



        public MySqlConnection GetConexionDb()
        {
            if (conexion == null)
            {
                conexion = new MySqlConnection(cadenaConexion);
                conexion.Open();
            }
            return conexion;
        }
    }
}
