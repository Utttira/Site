# Casino Demo (Sem Dinheiro Real)

Este projeto é um **casino demo** para fins educativos, sem pagamentos e sem dinheiro real.

## Conteúdo

- `index.html`: interface de roleta simples.
- `app.js`: lógica do jogo, saldo virtual, histórico e transparência de seed.
- `styles.css`: estilos base.

## Como executar

Como é um projeto estático, basta abrir o `index.html` no navegador.

Ou servir localmente:

```bash
python3 -m http.server 8000
```

Depois aceda a `http://localhost:8000`.

## Funcionalidades

- Saldo virtual inicial: 1000 créditos
- Aposta em vermelho/preto/verde
- Resultado pseudoaleatório com seed da sessão
- Histórico das jogadas
- Botão de reset do saldo

## Aviso

Não use este código para operar jogo a dinheiro real sem licenças, auditoria de RNG e conformidade legal.
