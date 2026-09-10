### Prompt 1

Esta seção deve ser executada com base no arquivo @context.md

---

### Prompt 2

Abaixo estão exemplos de intenções e seus respectivos planos de implementação

Intenção: O usuário deve conseguir recuperar a senha por e-mail
Plano:
1 Criar um endpoint para receber o pedido de recuperação de senha
2 Verificar se o e-mail informado existe na base
3 Se não existir, retornar uma resposta genérica sem revelar a ausência
4 Gerar um token temporário com prazo de expiração e persistir
5 Enviar o e-mail com o link de redefinição
6 Criar um endpoint para validar o token e atualizar a senha

Intenção: O usuário deve conseguir adicionar e remover produtos do carrinho
Plano:

1 Criar um modelo de carrinho vinculado ao usuário
2 Criar um endpoint para adicionar um produto ao carrinho
3 Se o produto já estiver no carrinho, incrementar a quantidade
4 Criar um endpoint para remover um produto do carrinho
5 Criar um endpoint para listar os itens do carrinho com o total

Intenção: O usuário deve conseguir finalizar o pedido com cálculo de frete
Plano:

1 Criar um endpoint para finalizar o pedido a partir do carrinho
2 Validar se o carrinho possui itens
3 Calcular o valor do frete com base no endereço informado
4 Somar o valor dos itens e o frete para obter o total
5 Criar o registro do pedido e esvaziar o carrinho
6 Retornar o pedido criado com o resumo dos valores

Intenção: O usuário deve conseguir ver o histórico de pedidos filtrado por período
Plano:

1 Criar um endpoint para listar os pedidos do usuário autenticado
2 Receber o período inicial e final como parâmetros opcionais
3 Se o período for informado, filtrar os pedidos por data de criação
4 Ordenar os pedidos do mais recente para o mais antigo
5 Retornar a lista com os dados resumidos de cada pedido

Intenção: Quero que o usuário consiga se cadastrar, fazer login e continuar autenticado entre sessões
Plano:

Salve o plano gerado em plans/RF01-plan.md

---

### Prompt 3

Intenção: Quero que o usuário consiga se cadastrar, fazer login e continuar autenticado entre sessões

Plano: @plans/RF01-plan.md

Gere o código seguindo o plano acima, passo a passo

---

### Prompt 4

Abaixo estão exemplos de intenções e seus respectivos planos de implementação

Intenção: O usuário deve conseguir se cadastrar, fazer login e continuar autenticado entre sessões

Plano:

1 Criar entidade User com campos: id, email, senha (hash), nome, dataInclusão
2 Criar endpoint POST /auth/register para cadastro com validação de email único
3 Hash da senha com bcrypt antes de persistir no banco
4 Criar endpoint POST /auth/login que valida email/senha e gera token JWT
5 Armazenar token JWT no localStorage do frontend
6 Criar middleware de autenticação para validar token nas requisições protegidas
7 Criar endpoint GET /auth/me para retornar dados do usuário autenticado
8 Implementar refresh token com expiração maior para renovar sessão
9 Frontend: interceptor HTTP para incluir token em todas as requisições
10 Frontend: verificar autenticação ao carregar app e redirecionar se inválido
11 Criar endpoint POST /auth/logout que invalida o token (opcional em JWT, blacklist se necessário)
12 Frontend: rota protegida que redireciona para login se não autenticado

Intenção: O usuário deve conseguir adicionar e remover produtos do carrinho
Plano:

1 Criar um modelo de carrinho vinculado ao usuário
2 Criar um endpoint para adicionar um produto ao carrinho
3 Se o produto já estiver no carrinho, incrementar a quantidade
4 Criar um endpoint para remover um produto do carrinho
5 Criar um endpoint para listar os itens do carrinho com o total

Intenção: O usuário deve conseguir finalizar o pedido com cálculo de frete
Plano:

1 Criar um endpoint para finalizar o pedido a partir do carrinho
2 Validar se o carrinho possui itens
3 Calcular o valor do frete com base no endereço informado
4 Somar o valor dos itens e o frete para obter o total
5 Criar o registro do pedido e esvaziar o carrinho
6 Retornar o pedido criado com o resumo dos valores

Intenção: O usuário deve conseguir ver o histórico de pedidos filtrado por período
Plano:

1 Criar um endpoint para listar os pedidos do usuário autenticado
2 Receber o período inicial e final como parâmetros opcionais
3 Se o período for informado, filtrar os pedidos por data de criação
4 Ordenar os pedidos do mais recente para o mais antigo
5 Retornar a lista com os dados resumidos de cada pedido

Intenção: Quero que o usuário autenticado consiga criar, ver, editar e excluir seus próprios quadros
Plano:

Salve o plano gerado em plans/RF02-plan.md

---

### Prompt 5

Intenção: Quero que o usuário autenticado consiga criar, ver, editar e excluir seus próprios quadros

Plano: @plans/RF02-plan.md

Gere o código seguindo o plano acima, passo a passo

---

### Prompt 6

Abaixo estão exemplos de intenções e seus respectivos planos de implementação

Intenção: O usuário deve conseguir se cadastrar, fazer login e continuar autenticado entre sessões

Plano:

1 Criar entidade User com campos: id, email, senha (hash), nome, dataInclusão
2 Criar endpoint POST /auth/register para cadastro com validação de email único
3 Hash da senha com bcrypt antes de persistir no banco
4 Criar endpoint POST /auth/login que valida email/senha e gera token JWT
5 Armazenar token JWT no localStorage do frontend
6 Criar middleware de autenticação para validar token nas requisições protegidas
7 Criar endpoint GET /auth/me para retornar dados do usuário autenticado
8 Implementar refresh token com expiração maior para renovar sessão
9 Frontend: interceptor HTTP para incluir token em todas as requisições
10 Frontend: verificar autenticação ao carregar app e redirecionar se inválido
11 Criar endpoint POST /auth/logout que invalida o token (opcional em JWT, blacklist se necessário)
12 Frontend: rota protegida que redireciona para login se não autenticado

Intenção: O usuário autenticado consiga criar, ver, editar e excluir seus próprios quadros

Plano:

1 Criar entidade Board com campos: id, usuarioId, titulo, descricao, corFundo, dataCriacao, dataAtualizacao
2 Criar relacionamento 1-N entre User e Board (um usuário tem muitos quadros)
3 Criar endpoint POST /boards para criar novo quadro (protegido)
4 Validar titulo não vazio e tamanho máximo (ex: 100 caracteres)
5 Criar endpoint GET /boards para listar todos os quadros do usuário autenticado (protegido)
6 Criar endpoint GET /boards/:id para obter detalhes de um quadro específico (protegido, validar propriedade)
7 Criar endpoint PATCH /boards/:id para editar quadro (protegido, validar propriedade)
8 Validar que só o dono pode editar/deletar seu quadro
9 Criar endpoint DELETE /boards/:id para deletar quadro (protegido, validar propriedade)
10 Frontend: página de listagem de quadros do usuário
11 Frontend: modal/formulário para criar novo quadro
12 Frontend: página de detalhes do quadro (editar titulo/descricao/cor)
13 Frontend: botão de delete com confirmação
14 Frontend: redirecionamento automático ao criar/editar/deletar
15 Frontend: tratamento de erros (não autorizado, quadro não existe, etc)

Intenção: O usuário deve conseguir finalizar o pedido com cálculo de frete
Plano:

1 Criar um endpoint para finalizar o pedido a partir do carrinho
2 Validar se o carrinho possui itens
3 Calcular o valor do frete com base no endereço informado
4 Somar o valor dos itens e o frete para obter o total
5 Criar o registro do pedido e esvaziar o carrinho
6 Retornar o pedido criado com o resumo dos valores

Intenção: O usuário deve conseguir ver o histórico de pedidos filtrado por período
Plano:

1 Criar um endpoint para listar os pedidos do usuário autenticado
2 Receber o período inicial e final como parâmetros opcionais
3 Se o período for informado, filtrar os pedidos por data de criação
4 Ordenar os pedidos do mais recente para o mais antigo
5 Retornar a lista com os dados resumidos de cada pedido

Intenção: Quero que o usuário consiga criar, renomear, reordenar e excluir listas dentro de um quadro
Plano:

Salve o plano gerado em plans/RF03-plan.md

---

### Prompt 7

Intenção: Quero que o usuário consiga criar, renomear, reordenar e excluir listas dentro de um quadro

Plano: @plans/RF03-plan.md

Gere o código seguindo o plano acima, passo a passo

---
