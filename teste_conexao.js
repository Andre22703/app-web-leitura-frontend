const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'sa12345',
  server: 'localhost', // só o host
  port: 1433,           // porta separada
  database: 'ReportServer$SQL2014',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testarLigacao() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Ligação à base de dados estabelecida com sucesso!");
    await pool.close();
  } catch (err) {
    console.error("❌ Erro ao ligar à base de dados:", err);
  }
}

testarLigacao();
