# solta — baixador de vídeos do TikTok sem marca d'água

## Rodar localmente

```bash
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.

## Publicar (deploy)

Esse projeto tem um backend em Node.js, então **não dá pra publicar arrastando pro Netlify** (isso só funciona pra sites estáticos, como o Watch+). Você precisa de um serviço que rode servidor Node. As opções mais fáceis e gratuitas:

### Opção 1: Render.com (recomendado, mais simples)
1. Crie uma conta em https://render.com
2. Suba esse projeto pro GitHub (crie um repositório novo e faça push desses arquivos)
3. No Render, clique em "New +" → "Web Service"
4. Conecte o repositório
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Clique em "Deploy" — em alguns minutos você tem uma URL pública tipo `solta.onrender.com`

### Opção 2: Railway.app
Parecido com o Render, também conecta direto no GitHub e detecta automaticamente que é um projeto Node.

## Como funciona

- O front-end (`public/index.html`) recebe o link do TikTok que você cola.
- Ele manda esse link pro backend (`server.js`).
- O backend chama a API pública do **tikwm.com**, que processa o vídeo do TikTok e devolve o link direto do arquivo MP4 sem a marca d'água.
- O front-end mostra a capa, o título, o autor e os botões de download.

## Observação importante

Como aqui no ambiente onde eu (Claude) montei o projeto não tenho acesso à internet, não consegui testar uma chamada real à API do tikwm.com. O código segue exatamente a mesma lógica que você já tinha validado antes, mas eu recomendo testar com `npm install && npm start` assim que baixar, colando um link real do TikTok, antes de publicar.

Se a API do tikwm.com mudar de formato de resposta no futuro, pode ser necessário ajustar os campos em `server.js` (a parte que lê `dados.data.play`, `dados.data.hdplay`, etc).
