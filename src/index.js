const express = require('express');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = 3334;

// Defina o endereço do Servidor 2
const SERVER_2_URL = 'http://18.231.162.175:3333/api/intermediary/';

app.use(express.json());

// Rota para intermediar a chamada de API
app.post('/api/intermediary', async (req, res) => {
  try {
    const { url, method, body, headers } = req.body;

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
app.listen(PORT, () => {
  console.log('Servidor intermediário está rodando na porta', PORT);
});