## 📋 Sobre o Projeto

O Remote Access Catalog é uma ferramenta que permite à equipe de suporte gerenciar conexões remotas com clientes através de diferentes plataformas:

- **TeamViewer**
- **AnyDesk** 
- **RDP (Remote Desktop Protocol)**
- **RustDesk**

## ✨ Funcionalidades

### 🔧 Funcionalidades Principais
- ✅ Conexão rápida via TeamViewer, AnyDesk, RDP e RustDesk
- ✅ Campos para ID do cliente e senha
- ✅ Gerenciamento de contatos salvos
- ✅ Histórico completo de acessos
- ✅ Interface responsiva e moderna
- ✅ Banco de dados SQLite integrado

### 🎯 Funcionalidades Específicas
- **Contatos Salvos**: Adicionar, editar, excluir e usar contatos salvos
- **Histórico de Acessos**: Registro automático de todas as conexões realizadas
- **Interface Intuitiva**: Design limpo e fácil de usar
- **Responsivo**: Funciona em desktop e dispositivos móveis

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **SQLite** - Banco de dados local
- **Lucide React** - Ícones

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd remote-access-catalog
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o projeto:**
```bash
npm run dev
```

4. **Abra no navegador:**
```
http://localhost:3000
```

## 🗂️ Estrutura do Projeto

```
remote-access-catalog/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contacts/
│   │   │   │   └── route.ts
│   │   │   └── access-logs/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── table.tsx
│   │   └── RemoteAccessApp.tsx
│   └── lib/
│       ├── database.ts
│       └── utils.ts
├── contatos.db (criado automaticamente)
├── package.json
└── README.md
```

## 💾 Banco de Dados

O projeto utiliza SQLite com duas tabelas principais:

### Tabela `contatos`
- `contato` - Nome do contato
- `id` - ID do cliente
- `tipo` - Tipo de conexão (TeamViewer, AnyDesk, RDP, RustDesk)
- `password` - Senha de acesso

### Tabela `acessos`
- `data` - Data e hora do acesso
- `id` - ID do cliente
- `tipo` - Tipo de conexão utilizada
- `password` - Senha utilizada

## 🎮 Como Usar

### 1. Conexão Rápida
1. Digite o **ID do cliente** no campo correspondente
2. Digite a **senha** (opcional)
3. Clique no botão da plataforma desejada (TV, Rust, Any, RDP)

### 2. Gerenciar Contatos
1. Clique no ícone de **configurações** (engrenagem)
2. Clique em **"Adicionar Contato"**
3. Preencha os dados: Nome, ID, Tipo e Senha
4. Clique em **"Salvar"**

### 3. Usar Contato Salvo
1. Abra a lista de contatos
2. Clique em **"Usar"** no contato desejado
3. Os campos serão preenchidos automaticamente

### 4. Ver Histórico
1. Clique no ícone de **histórico** (relógio)
2. Visualize todos os acessos realizados com data e hora

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar versão de produção
npm start

# Linting
npm run lint
```

## 🌐 Deploy

Para fazer deploy da aplicação:

1. **Build do projeto:**
```bash
npm run build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto mantém a mesma licença do projeto original.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Abra uma issue no repositório
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido para facilitar o trabalho da equipe de suporte** 🚀