# Nossa História

Álbum pessoal em HTML, CSS e JavaScript, com 15 fotos, uma memória em vídeo, playlist do Spotify, mensagem e contador desde 12 de outubro de 2025. A identidade visual usa degradês rosa e roxo, brilho e uma entrada com partículas.

## Executar

Não há build nem dependências JavaScript de terceiros. Sirva a raiz com um servidor HTTP estático (por exemplo, a extensão Live Server do editor) e abra `index.html`. Também é possível abrir o arquivo diretamente; a playlist exige conexão e pode depender das políticas do navegador.

Na Vercel, mantenha o projeto como site estático, com a raiz do repositório como diretório de publicação e sem comando de build. O player do Spotify continua sujeito às permissões e limitações do próprio serviço; o botão de entrada não promete iniciar música automaticamente.

## Personalizar o álbum

Edite `js/config.js`:

| Campo | Uso |
| --- | --- |
| `startDate` | Data e hora inicial em ISO 8601, com deslocamento explícito, por exemplo `2025-10-12T00:00:00-03:00`. |
| `timeZone` | Fuso do contador. O álbum atual usa `America/Sao_Paulo`, inclusive para visitantes de outros fusos. |
| `pageTitle`, `title`, `subtitle`, `message` | Título da aba e textos visíveis. Use `\n` dentro de strings para separar trechos no arquivo. |
| `spotifyEmbedUrl` | URL de incorporação obtida em Compartilhar → Incorporar playlist no Spotify. |
| `photoDuration` | Tempo de cada foto em milissegundos; o padrão é 10000. |
| `media` | Lista de fotos e vídeos, na ordem de exibição. |

Para adicionar uma foto, coloque o arquivo em `images/` e acrescente um item:

```js
{ src: 'images/nova-memoria.jpg', width: 1200, height: 1600, alt: 'Descrição breve do momento registrado' }
```

Use as dimensões reais da imagem e uma descrição fiel. Os textos alternativos atuais identificam cada memória pela posição e podem ser enriquecidos com os detalhes de cada momento. Para um vídeo em MP4, coloque o arquivo em `videos/` e acrescente:

```js
{ src: 'videos/nova-memoria.mp4', type: 'video', alt: 'Descrição breve da memória em vídeo' }
```

Os arquivos originais foram preservados. Ao editar textos ou a playlist, atualize também os equivalentes estáticos em `index.html` para manter a leitura sem JavaScript consistente.

## Comportamento

- Setas, teclas direcionais e gesto horizontal nas fotos permitem navegar, inclusive do último slide para o primeiro.
- As fotos avançam automaticamente após 10 segundos, em ciclo infinito, inclusive com foco ou ponteiro sobre o carrossel. Não há indicadores em pontos.
- O vídeo começa sem som apenas quando ativo e visível, tem controles nativos e avança ao terminar. Ao retornar ao slide, começa do início. Se o navegador bloquear a reprodução, uma mensagem orienta a iniciá-la manualmente.
- Ao sair da área visível ou ocultar a aba, a apresentação pausa. As partículas encerram após a entrada; o contador suspende atualizações em abas ocultas e recalcula ao voltar.
- Movimento reduzido desativa as animações visuais; a apresentação continua avançando automaticamente.
- As fotos carregam sob demanda, com espaço reservado. O Spotify só é solicitado depois da entrada. Sem JavaScript, os textos e links para a primeira foto, vídeo e playlist continuam acessíveis.

## Estrutura

```text
index.html             Estrutura e conteúdo estático de apoio
css/style.css          Visual, responsividade e movimento reduzido
js/config.js           Conteúdo e preferências do álbum
js/counter.js          Diferença de calendário e atualização do contador
js/carousel.js         Navegação e reprodução das mídias
js/main.js             Entrada, partículas e inicialização
images/ e videos/      Mídias originais
tests/                 Testes sem dependências externas
```

## Verificar alterações

Com Node.js instalado, execute na raiz:

```sh
node --test
node --check js/config.js
node --check js/counter.js
node --check js/carousel.js
node --check js/main.js
git diff --check
```

Os testes cobrem viradas de mês, fevereiro bissexto, datas futuras, fusos e integridade das referências às mídias. Antes de publicar, confira também a entrada por teclado, todas as mídias, o avanço automático, o término do vídeo e a página em larguras de 320, 390, 768 e 1280 pixels. Gestos e políticas de reprodução devem ser conferidos também em aparelhos reais.

## Próxima etapa

Separar uma versão padrão com conteúdo demonstrativo para clientes e definir sua forma de personalização e entrega. A alteração de visibilidade deste repositório para privado fica para essa etapa; a visibilidade do GitHub e o acesso ao site publicado são configurações independentes.

As transições usam uma abertura vetorial em coração: em tela cheia na entrada e sobre a memória anterior no carrossel. A implementação web está em js/transitions.js; o projeto After Effects de referência não é uma dependência do site. Movimento reduzido desativa o efeito.

