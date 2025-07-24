# Sol Backoffice - PWA

Este projeto está configurado como um Progressive Web App (PWA) que oferece uma experiência similar a um aplicativo nativo.

## 🚀 Funcionalidades PWA

### ✅ Funcionalidades Implementadas

1. **Service Worker**
   - Cache de recursos estáticos
   - Funcionamento offline
   - Atualizações automáticas
   - Cache de API com estratégia "freshness"

2. **Web App Manifest**
   - Instalação na tela inicial
   - Ícones em diferentes tamanhos
   - Tema personalizado
   - Shortcuts para navegação rápida

3. **Notificações**
   - Sistema de notificações push
   - Notificações locais
   - Gerenciamento de permissões

4. **Status PWA**
   - Indicador de status online/offline
   - Prompt de instalação
   - Notificação de atualizações disponíveis

## 📱 Como Instalar

### No Desktop (Chrome/Edge)
1. Acesse a aplicação no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou use o prompt de instalação que aparece no topo da página

### No Mobile (Android)
1. Abra a aplicação no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"

### No iOS (Safari)
1. Abra a aplicação no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à tela inicial"

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento (sem service worker)
npm start

# Produção local (com service worker)
npm run serve:prod

# Build de produção
npm run build:prod
```

### Testando o PWA

1. **Build de produção:**
   ```bash
   npm run build:prod
   ```

2. **Servir arquivos estáticos:**
   ```bash
   npx http-server dist/sol-expenses.web -p 8080
   ```

3. **Acessar:**
   - http://localhost:8080

## 📋 Checklist PWA

- [x] Service Worker configurado
- [x] Web App Manifest
- [x] Ícones em múltiplos tamanhos
- [x] Meta tags para PWA
- [x] Funcionamento offline
- [x] Cache de recursos
- [x] Notificações
- [x] Prompt de instalação
- [x] Status online/offline
- [x] Atualizações automáticas

## 🔧 Configurações

### Service Worker (`ngsw-config.json`)
- Cache de assets com prefetch
- Cache de API com estratégia freshness
- Configuração de navegação

### Manifest (`public/manifest.webmanifest`)
- Nome: "Sol Backoffice"
- Tema: #1976d2
- Display: standalone
- Shortcuts configurados

### Ícones
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- Formatos: PNG com propósito maskable

## 📊 Métricas PWA

Para verificar se o PWA está funcionando corretamente:

1. **Lighthouse Audit**
   - Abra DevTools
   - Vá para a aba Lighthouse
   - Execute o audit PWA

2. **Chrome DevTools**
   - Application > Service Workers
   - Application > Manifest
   - Application > Storage

## 🐛 Troubleshooting

### Service Worker não registra
- Verifique se está usando HTTPS ou localhost
- Confirme se o build é de produção
- Verifique os logs no DevTools

### Ícones não aparecem
- Verifique se os arquivos existem em `public/icons/`
- Confirme se o manifest está correto
- Limpe o cache do navegador

### Notificações não funcionam
- Verifique as permissões do navegador
- Confirme se está usando HTTPS
- Teste em modo de produção

## 📚 Recursos Adicionais

- [Angular PWA Documentation](https://angular.dev/guide/service-worker)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/) 
