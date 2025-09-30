const keytar = require("keytar");

async function update() {
  // ⚡ muda aqui o utilizador e a senha
  await keytar.setPassword("app-web-leitura", "db-user", "NOVO_USER");
  await keytar.setPassword("app-web-leitura", "db-password", "NovaSenha@2024");

  console.log("✅ Credenciais atualizadas no Credential Manager!");
}

update();
