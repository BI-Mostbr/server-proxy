const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3334;

// Defina o endereço do Servidor
const SERVER_2_URL = 'http://18.231.167.245:3333/api/intermediary/';

const certificado = fs.readFileSync('/etc/letsencrypt/live/mostbr.com.br.server-node.mostbr.com.br/cert.pem');
const chave = fs.readFileSync('/etc/letsencrypt/live/mostbr.com.br.server-node.mostbr.com.br/privkey.pem');
const ca = fs.readFileSync('/etc/letsencrypt/live/mostbr.com.br.server-node.mostbr.com.br/chain.pem');

const corsOptions = {
    origin:
    [
      'https://app.flutterflow.io', 
      'https://app.mostbr.com.br', 
      'https://sistema-m-o-s-t-veayjp.flutterflow.app', 
      'https://ff-debug-service-frontend-pro-ygxkweukma-uc.a.run.app', 
      'https://ff-debug-service-frontend-pro-ygxkweukma-uc.a.run.app'
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const credentials = {
    key: chave,
    cert: certificado,
    ca: ca
}

app.use(cors(corsOptions));
app.use(express.json());

// Rota para intermediar a chamada de API
app.post('/api/intermediary', async (req, res) => {
  try {
    const { url, method, body, headers } = req.body;

    console.log(JSON.stringify(body))

    // Faz a requisição para o Servidor 2 via HTTP
    const response = await axios({
      method: 'POST',
      url: SERVER_2_URL, // Rota no Servidor 2 para intermediar a chamada de API
      data: { url, method, body, headers }, // Envie os dados originais para o Servidor 2
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Permite conexões HTTPS não confiáveis
      })
    });
    
    // Retorna a resposta do Servidor 2 para o cliente (Insomnia)
    res.json(response.data);
  } catch (error) {
    // Em caso de erro, retorna um erro 500
    res.status(500).json({ error: error.message });
  }
});

// Iniciando o servidor
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log('Servidor rodando');
});