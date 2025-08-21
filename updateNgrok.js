const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const BIN_ID = "68a2e0a5d0ea881f405c44d8";
const API_KEY = "$2a$10$RKrrtUJtw.UpRgJQAwsUyOElRGt4k7eDAUxluSs2g2cSmwhx1UIhW";

const LOJA_ID = "Mimos"; // alterar conforme a loja
const ENV_PATH = path.resolve(__dirname, '.env.local');

async function updateNgrok() {
  try {
    const res = await fetch("http://localhost:3001/ngrok-url");
    const data = await res.json();
    const ngrokUrl = data.url;
    if (!ngrokUrl) throw new Error("Nenhum URL do ngrok encontrado.");
    console.log("🔹 Ngrok URL:", ngrokUrl);

    // 1️⃣ Buscar conteúdo atual do JSONBin
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const binData = await getRes.json();
    const lojas = binData.record.lojas || {};

    // 2️⃣ Atualizar apenas a loja atual
    lojas[LOJA_ID] = ngrokUrl;

    // 3️⃣ Atualizar JSONBin
    const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY },
      body: JSON.stringify({ lojas })
    });
    console.log("✅ JSONBin atualizado:", await updateRes.json());

    // 4️⃣ Atualizar .env.local se quiser (opcional)
    let envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
    const envLine = `REACT_APP_API_URL=${ngrokUrl}`;
    envContent = envContent.includes('REACT_APP_API_URL=') ?
      envContent.replace(/REACT_APP_API_URL=.*/g, envLine) :
      envContent + `\n${envLine}\n`;
    fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
    console.log("✅ .env.local atualizado:", envLine);

  } catch (err) {
    console.error("❌ Erro ao atualizar ngrok:", err);
  }
}

updateNgrok();
