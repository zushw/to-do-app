# Visão Geral

O projeto é um sistema de gerenciamento de tarefas baseado na web (To-Do List) projetado para permitir que os usuários organizem suas vidas diárias por meio de categorias, ao mesmo tempo em que permite o trabalho colaborativo através do compartilhamento de tarefas.

## Levantamento de Requisitos

### Requisitos Funcionais

- Criação de conta e autenticação de usuário (Login/Logout).
- CRUD completo para tarefas.
- CRUD para categorias para organizar tarefas.
- Funcionalidade de compartilhamento de tarefas entre usuários.
- Alternância de status da tarefa (Concluída / Não concluída).
- Filtragem de tarefas (por status ou categoria).
- Paginação na lista de tarefas.
- Integração com uma API externa.

### Requisitos Não Funcionais

- Segurança: 
    - As senhas dos usuários devem ser criptografadas (hashed).
    - Os usuários só podem acessar, modificar ou excluir suas próprias tarefas.
- Desempenho: Os tempos de resposta da API devem ser otimizados utilizando paginação.
- Usabilidade: A interface do usuário deve ser responsiva.
- Manutenibilidade: A base de código deve ser modular, aderindo a padrões de projeto e melhores práticas (SOLID, DRY, KISS) para garantir a escalabilidade futura e a facilidade de manutenção.
- Disponibilidade e Portabilidade: O sistema deve ser facilmente portátil e capaz de rodar de forma consistente em diferentes ambientes.

## Tecnologias Utilizadas

- Backend: Desenvolvido em Python utilizando Django REST Framework.
- Frontend: Desenvolvido em React + Vite utilizando Tailwind CSS e Axios.
- Qualidade: Testes unitários no backend usando `pytest` e testes E2E no frontend usando `Selenium`.
- Infraestrutura: Aplicação totalmente conteinerizada usando Docker e Docker Compose.
- DevOps: Pipeline de CI/CD configurada para validação contínua de código.
- Deploy: Hospedagem em nuvem (AWS ou Azure).

## Rodando o projeto

### Pre requisitos
- Docker instalado.
- Docker Compose instalado.

### Instalação e setup

1. Clonar o repositório:

```bash
git clone https://github.com/zushw/to-do-app.git
cd to-do-app
```

2. Rodar Docker Compose:
```bash
docker-compose up --build
```

3. Migrações do Banco de dados:
```bash
docker-compose exec backend python manage.py migrate
```

4. Criar um super user (Opcional):
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Acessando a aplicação

| Serviço | URL | 
| :--- | :--- | 
| **Frontend (React)** | [http://localhost:5173](http://localhost:5173) | 
| **Backend API** | [http://localhost:8000/api/v1](http://localhost:8000/api/v1) | 
| **Django Admin** | [http://localhost:8000/admin](http://localhost:8000/admin) | 

## Deploy em prod (Azure)

- Frontend: https://thankful-sea-04872d00f.6.azurestaticapps.net
- Backend API: https://todo-backend-api-g5aphmazfwetdghs.brazilsouth-01.azurewebsites.net/api/v1

## Arquitetura de banco de dados

### Entidades e Relacionamentos

1. User:
    - Gerenciado pelo sistema de autenticação padrão do Django.
    - Campos: ```id```, ```username```, ```email```, ```password```.

2. Category:
    - Usada para agrupar e organizar tarefas.
    - Campos:
        - ```id``` (Primary Key)
        - ```name``` (String, max 100 caracteres)
        - ```owner``` (Foreign Key -> ```User```): Garante que os usuários vejam apenas suas próprias categorias.

3. Tasks:
    - A entidade central da aplicação.
    - Campos: 
        - ```id``` (Primary Key)
        - ```title``` (String, máximo de 200 caracteres)
        - ```description``` (Text, opcional)
        - ```is_completed``` (Boolean, padrão: False)
        - ```created_at``` (DateTime, gerado automaticamente)
        - ```category``` (Foreign Key -> ```Category```, opcional)
        - ```owner``` (Foreign Key -> ```User```): O criador da tarefa.
        - ```shared_with``` (ManyToMany -> ```User```): Permite que múltiplos usuários visualizem/interajam com a tarefa.
        - ```external_quote``` (Text, opcional): Armazena os dados obtidos da API externa (por exemplo, uma frase motivacional salva quando a tarefa é concluída).