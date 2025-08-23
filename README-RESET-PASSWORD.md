# Funcionalidade de Reset de Senha

Esta funcionalidade permite que usuários redefinam suas senhas de forma segura através de um processo de duas etapas.

## Como Funciona

### 1. Solicitação de Reset
- O usuário acessa a página de login
- Clica em "Esqueceu sua senha?"
- Digita seu email na página de solicitação
- O sistema envia um email com um token de reset

### 2. Definição de Nova Senha
- O usuário clica no link do email recebido
- É redirecionado para a página de nova senha
- Digita e confirma a nova senha
- O sistema valida e salva a nova senha

## Endpoints da API

### Solicitar Reset de Senha
```
POST /api/v1/users/forgot-password
Body: { "email": "usuario@exemplo.com" }
```

### Confirmar Nova Senha
```
PATCH /api/v1/users/reset-password
Body: {
  "token": "token_do_email",
  "password": "nova_senha",
  "confirmPassword": "confirmacao_senha"
}
```

## Rotas Implementadas

- `/forgot-password` - Página para solicitar reset
- `/reset-password?token=xxx` - Página para definir nova senha

## Componentes Criados

### ForgotPasswordComponent
- Formulário para solicitar reset de senha
- Validação de email
- Integração com o serviço de autenticação
- **Usa o mesmo layout da tela de confirmar email**

### ResetPasswordComponent
- Formulário para definir nova senha
- Validação de senha (mínimo 6 caracteres)
- Validação de confirmação de senha
- Verificação de token da URL
- **Usa o mesmo layout da tela de confirmar email**

## Layout e Design

**Ambas as telas seguem exatamente o mesmo padrão da tela de confirmar email:**

- **app-auth-layout** - Layout de autenticação consistente
- **app-input** - Componente de input padronizado
- **app-loading** - Indicador de carregamento
- **sol-button** - Botões com estilo padrão
- **sol-title** e **sol-subtitle** - Classes de título padronizadas
- **sol-link** - Links com estilo padrão

## Validações Implementadas

### Email
- Campo obrigatório
- Formato de email válido

### Senha
- Campo obrigatório
- Mínimo de 6 caracteres
- Confirmação deve ser idêntica

## Fluxo de Navegação

1. **Login** → Clique em "Esqueceu sua senha?"
2. **Solicitar Reset** → Digite email e envie
3. **Email Recebido** → Clique no link
4. **Nova Senha** → Digite e confirme nova senha
5. **Sucesso** → Redirecionamento para login

## Segurança

- Tokens de reset são únicos e temporários
- Senhas são validadas no frontend e backend
- Redirecionamento automático em caso de erro
- Limpeza de dados sensíveis após uso

## Consistência Visual

- **Layout idêntico** ao da tela de confirmar email
- **Componentes padronizados** do sistema
- **Estilos consistentes** com variáveis CSS
- **Responsividade** mantida em todas as telas
- **Estados de loading** padronizados

## Correções Implementadas

### ✅ URLs dos Endpoints Corrigidas
- **Antes**: `/v1/auth/forgot-password` e `/v1/auth/reset-password`
- **Depois**: `/v1/users/forgot-password` e `/v1/users/reset-password`

### ✅ Método HTTP Corrigido
- **Reset Password**: Agora usa `PATCH` em vez de `POST` (conforme API)

### ✅ Estrutura da API
- **Prefixo**: `/api` (configurado globalmente)
- **Versão**: `/v1` (padrão)
- **Controller**: `UserController` (não `AuthController`)

## Como Testar

1. Acesse a página de login
2. Clique em "Esqueceu sua senha?"
3. Digite um email válido
4. Verifique se a validação funciona
5. Teste com email inválido
6. Teste a responsividade em diferentes tamanhos de tela
7. Compare o visual com a tela de confirmar email
8. **Verifique se as requisições estão indo para as URLs corretas**

## Dependências

- Angular Reactive Forms
- Angular Router
- Serviço de Toast para notificações
- Serviço de Loading para estados de carregamento
- Serviço HTTP para comunicação com API
- **Componentes padrão do sistema** (app-auth-layout, app-input, app-loading)

## Troubleshooting

### Erro 404 nos Endpoints
Se você encontrar erro 404, verifique:

1. **URLs corretas**:
   - Forgot Password: `POST /api/v1/users/forgot-password`
   - Reset Password: `PATCH /api/v1/users/reset-password`

2. **Método HTTP correto**:
   - Reset Password usa `PATCH`, não `POST`

3. **API rodando**:
   - Verifique se a API está rodando na porta 8080
   - Confirme se o prefixo `/api` está configurado

4. **Controller registrado**:
   - `UserController` deve estar registrado no `ApiModule`
