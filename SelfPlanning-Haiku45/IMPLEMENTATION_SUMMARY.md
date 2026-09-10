# RF01 - Implementação de Autenticação

## Status: ✅ Completo

Autenticação de usuário com registro, login e manutenção de sessão implementada.

### Backend (Express + TypeORM)

**Entidades:**
- `User` - id (UUID), email (único), nome, senha (bcrypt), dataInclusão

**Rotas:**
- `POST /auth/register` - Cadastro com validação de email único
- `POST /auth/login` - Login com geração de JWT e refresh token
- `GET /auth/me` - Dados do usuário autenticado (protegido)
- `POST /auth/refresh` - Renovação de token JWT
- `POST /auth/logout` - Logout (protegido)

**Middleware:**
- `verifyToken` - Valida JWT em rotas protegidas

**Segurança:**
- Senhas com hash bcrypt (10 rounds)
- JWT com expiração 15 minutos
- Refresh token com expiração 7 dias
- Email não revelado em caso de cadastro duplicado

### Frontend (Next.js 16 + React 19)

**Componentes:**
- `ProtectedRoute` - Wrapper para rotas que exigem autenticação
- `AuthProvider` - Context com estado de autenticação
- `useAuth` - Hook para acessar dados e funções de autenticação

**Páginas:**
- `/login` - Formulário de login com redirecionamento
- `/register` - Formulário de cadastro
- `/` - Home protegida com dados do usuário e botão logout

**Interceptor HTTP:**
- Axios com interceptor que:
  - Inclui token JWT em todas requisições
  - Renova token automaticamente ao expirar (refresh token)
  - Redireciona para login se refresh falhar

**Funcionalidades:**
- Verificação de autenticação ao carregar app
- Persistência de sessão via localStorage
- Redirecionamento automático para login se não autenticado
- Logout com limpeza de tokens

### Variáveis de Ambiente

**Backend (.env):**
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tcc_db
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Como Usar

1. Subir banco de dados:
   ```bash
   cd back-end
   docker-compose up
   ```

2. Iniciar backend:
   ```bash
   cd back-end
   npm run dev
   ```

3. Iniciar frontend:
   ```bash
   cd front-end
   npm run dev
   ```

4. Acessar http://localhost:3000 e cadastrar/fazer login

### Arquivos Criados

**Backend:**
- `src/database.ts` - Configuração TypeORM
- `src/entities/User.ts` - Entidade User
- `src/routes/auth.ts` - Rotas de autenticação
- `src/middleware/auth.ts` - Middleware de autenticação

**Frontend:**
- `src/lib/api.ts` - Cliente HTTP com interceptor
- `src/context/AuthContext.tsx` - Context de autenticação
- `src/components/ProtectedRoute.tsx` - Componente de rota protegida
- `src/app/login/page.tsx` - Página de login
- `src/app/register/page.tsx` - Página de registro
- `src/app/page.tsx` - Home protegida
