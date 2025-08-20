# ================= CONFIGURAÇÃO =================
$vercelToken = "vQTLsAmOahxFm8nIEcfdjiOg"
$projectId = "prj_TFsEaOaaWWJDWkdakVYkRm4YX3Ry"
$projectName = "app-web-leitura"

# Número máximo de tentativas para esperar o ngrok iniciar
$maxRetries = 10
$waitSeconds = 2

# ================= PEGAR URL DO NGROK =================
$ngrokURL = $null
for ($i=0; $i -lt $maxRetries; $i++) {
    try {
        $ngrokData = Invoke-RestMethod http://127.0.0.1:4040/api/tunnels
        if ($ngrokData.tunnels.Count -gt 0) {
            $ngrokURL = $ngrokData.tunnels[0].public_url
            break
        }
    } catch {
        Write-Host "Ngrok ainda não iniciou, aguardando $waitSeconds segundos..."
        Start-Sleep -Seconds $waitSeconds
    }
}

if (-not $ngrokURL) {
    Write-Host "Não foi possível obter o URL do ngrok após $($maxRetries * $waitSeconds) segundos."
    exit
}

Write-Host "Ngrok URL detectado: $ngrokURL"

# ================= ATUALIZAR OU CRIAR VARIÁVEL NO VERCEL =================
try {
    # 1️⃣ Obter variáveis existentes
    $envs = Invoke-RestMethod -Method GET -Uri "https://api.vercel.com/v9/projects/$projectId/env" `
        -Headers @{ "Authorization" = "Bearer $vercelToken" }

    # 2️⃣ Procurar variável existente
    $envVar = $envs.envs | Where-Object { $_.key -eq "REACT_APP_API_URL" -and $_.target -contains "production" }

    if ($envVar) {
        # 3️⃣ Atualizar variável existente
        $body = @{
            value = $ngrokURL
            type  = "encrypted"  # ou "plain"
        } | ConvertTo-Json

        Invoke-RestMethod -Method PATCH -Uri "https://api.vercel.com/v9/projects/$projectId/env/$($envVar.id)" `
            -Headers @{ "Authorization" = "Bearer $vercelToken"; "Content-Type" = "application/json" } `
            -Body $body

        Write-Host "Variável REACT_APP_API_URL atualizada no Vercel com sucesso!"
    } else {
        # 4️⃣ Criar variável se não existir
        $body = @{
            key = "REACT_APP_API_URL"
            value = $ngrokURL
            target = @("production")
            type = "encrypted"  # ou "plain"
        } | ConvertTo-Json

        Invoke-RestMethod -Method POST -Uri "https://api.vercel.com/v9/projects/$projectId/env" `
            -Headers @{ "Authorization" = "Bearer $vercelToken"; "Content-Type" = "application/json" } `
            -Body $body

        Write-Host "Variável REACT_APP_API_URL criada no Vercel com sucesso!"
    }
} catch {
    Write-Host "Erro ao atualizar variável no Vercel: $_"
    exit
}

# ================= REDEPLOY DA APP =================
$deployBody = @{
    name   = $projectName   # em vez de project
    target = "production"
} | ConvertTo-Json

try {
    $deployResponse = Invoke-RestMethod -Method POST -Uri "https://api.vercel.com/v13/deployments" `
        -Headers @{ "Authorization" = "Bearer $vercelToken"; "Content-Type" = "application/json" } `
        -Body $deployBody
    Write-Host "Redeploy iniciado com sucesso!"
} catch {
    Write-Host "Erro ao iniciar redeploy: $_"
}


