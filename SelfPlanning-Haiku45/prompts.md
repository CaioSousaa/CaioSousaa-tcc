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
