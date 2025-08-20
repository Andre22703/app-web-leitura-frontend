// updateNgrokAndStartReact.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2
const { exec } = require('child_process');

const BIN_ID = "68a2e0a5d0ea881f405c44d8";
const API_KEY = "$2a$10$RKrrtUJtw.UpRgJQAwsUyOElRGt4k7eDAUxluSs2g2cSmwhx1UIhW";
const ENV_PATH = path.resolve(__dirname, '.env.local'); // caminho para o .env do React

async function updateNgrok() {
  try {
    console.log("🔹 Buscando URL do ngrok na API local...");
    const res = await fetch("http://localhost:3001/ngrok-url");
    const data = await res.json();
    console.log("✅ Resposta da API local:", data);

    const ngrokUrl = data.url;
    if (!ngrokUrl) throw new Error("Nenhum URL do ngrok encontrado na resposta da API local.");
    console.log("🔹 Ngrok URL atual:", ngrokUrl);

    console.log("🔹 Atualizando JSONBin...");
    const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ ngrok: ngrokUrl })
    });
    const updateResult = await updateRes.json();
    console.log("✅ JSONBin atualizado:", updateResult);

    console.log("🔹 Atualizando arquivo .env.local...");
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    }

    const envLine = `REACT_APP_API_URL=${ngrokUrl}`;
    if (envContent.includes('REACT_APP_API_URL=')) {
      envContent = envContent.replace(/REACT_APP_API_URL=.*/g, envLine);
    } else {
      envContent += `\n${envLine}\n`;
    }

    fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
    console.log("✅ .env.local atualizado com sucesso:", envLine);

    console.log("🎉 Iniciando React app...");
    const reactProcess = exec('npm start', { cwd: __dirname });

    reactProcess.stdout.on('data', data => console.log(data));
    reactProcess.stderr.on('data', data => console.error(data));
    reactProcess.on('close', code => console.log(`React app encerrado com código ${code}`));

  } catch (err) {
    console.error("❌ Erro ao atualizar ngrok:", err);
  }
}

updateNgrok();
