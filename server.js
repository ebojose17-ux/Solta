const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function extrairLinkTikTok(texto) {
  const regex = /(https?:\/\/(?:www\.|vm\.|vt\.|m\.)?tiktok\.com\/\S+)/i;
  const match = texto.match(regex);
  return match ? match[0] : null;
}

app.post('/api/download', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ erro: 'Envie um link do TikTok válido.' });
    }

    const link = extrairLinkTikTok(url.trim());
    if (!link) {
      return res.status(400).json({ erro: 'Não encontrei um link do TikTok nesse texto.' });
    }

    const resposta = await axios.post(
      'https://tikwm.com/api/',
      new URLSearchParams({ url: link, hd: '1' }).toString(),
      {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://tikwm.com/',
          'Origin': 'https://tikwm.com',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      }
    );

    const dados = resposta.data;

    if (!dados || dados.code !== 0 || !dados.data) {
      return res.status(502).json({ erro: 'Não consegui processar esse vídeo. Verifique o link ou tente novamente.' });
    }

    const v = dados.data;

    res.json({
      sucesso: true,
      titulo: v.title || 'Vídeo do TikTok',
      autor: v.author?.nickname || v.author?.unique_id || 'Desconhecido',
      capa: v.cover || v.origin_cover || '',
      duracao: v.duration || null,
      video_sem_marca: v.play ? `https://www.tikwm.com${v.play}`.replace('https://www.tikwm.comhttps', 'https') : v.play,
      video_hd: v.hdplay ? (v.hdplay.startsWith('http') ? v.hdplay : `https://www.tikwm.com${v.hdplay}`) : null,
      video_com_marca: v.wmplay || null,
      audio: v.music || null
    });

  } catch (err) {
    console.error('Erro ao baixar vídeo:', err.message);
    res.status(500).json({ erro: 'Erro no servidor ao tentar baixar o vídeo. Tente novamente em instantes.' });
  }
});

app.get('/api/saude', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Solta rodando na porta ${PORT}`);
});
