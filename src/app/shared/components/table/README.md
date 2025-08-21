# Componente de Tabela (TableComponent)

## Visão Geral

O `TableComponent` é um componente reutilizável para exibir dados em formato tabular com suporte a paginação, ordenação, busca e larguras personalizáveis das colunas.

## Funcionalidades

- ✅ **Paginação** com navegação entre páginas
- ✅ **Ordenação** por colunas específicas
- ✅ **Busca** em tempo real
- ✅ **Larguras personalizáveis** das colunas
- ✅ **Tipos de coluna** (checkbox, ações, texto)
- ✅ **Estados de loading** e dados vazios
- ✅ **Responsivo** para mobile e desktop

## Uso Básico

```typescript
import { TableColumn } from '@shared/components/table/models/table-column.model';

// Definir as colunas da tabela
readonly columns = signal<TableColumn<UserModel>[]>([
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    width: '200px' // Largura fixa
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    width: '300px' // Largura fixa
  },
  {
    key: 'role',
    label: 'Cargo',
    sortable: true,
    width: '150px' // Largura fixa
  },
  {
    key: 'actions',
    label: 'Ações',
    type: 'actions',
    width: '100px' // Largura fixa
  }
]);
```

## Propriedades das Colunas

### TableColumn<T>

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `key` | `keyof T & string` | ✅ | Chave única da coluna (deve corresponder a uma propriedade do modelo) |
| `label` | `string` | ✅ | Texto exibido no cabeçalho da coluna |
| `sortable` | `boolean` | ❌ | Define se a coluna pode ser ordenada |
| `width` | `string \| number` | ❌ | Largura da coluna (px, %, em, etc.) |
| `type` | `'checkbox' \| 'actions'` | ❌ | Tipo especial da coluna |
| `value` | `(row: T) => any` | ❌ | Função para formatar o valor da célula |
| `actions` | `Action[]` | ❌ | Lista de ações para colunas do tipo 'actions' |

## Larguras das Colunas

### Comportamento

- **Se `width` for definido**: A coluna terá a largura especificada
- **Se `width` não for definido**: A coluna terá largura automática (`auto`)

### Formatos Suportados

```typescript
// Pixels
width: '200px'

// Porcentagem
width: '25%'

// Unidades CSS válidas
width: '15em'
width: '2rem'

// Números (serão convertidos para pixels)
width: 200 // Equivale a '200px'

// Largura automática (padrão)
// width: undefined // Equivale a 'auto'
```

### Exemplos de Uso

```typescript
readonly columns = signal<TableColumn<UserModel>[]>([
  // Coluna com largura fixa em pixels
  {
    key: 'id',
    label: 'ID',
    width: '80px'
  },
  
  // Coluna com largura em porcentagem
  {
    key: 'name',
    label: 'Nome',
    width: '30%'
  },
  
  // Coluna com largura automática
  {
    key: 'description',
    label: 'Descrição'
    // width não definido = 'auto'
  },
  
  // Coluna com largura em unidades CSS
  {
    key: 'email',
    label: 'Email',
    width: '20em'
  }
]);
```

## Tipos de Coluna Especiais

### Checkbox

```typescript
{
  key: 'select',
  label: '',
  type: 'checkbox',
  width: '50px',
  onChange: (row: UserModel, checked: boolean) => {
    // Lógica para seleção
  }
}
```

### Ações

```typescript
{
  key: 'actions',
  label: 'Ações',
  type: 'actions',
  width: '120px',
  actions: [
    {
      label: 'Editar',
      callback: (row: UserModel) => this.editUser(row)
    },
    {
      label: 'Excluir',
      callback: (row: UserModel) => this.deleteUser(row)
    }
  ]
}
```

## Template HTML

```html
<sol-table
  [columns]="columns()"
  [data]="users()"
  [loading]="loading()"
  [paginable]="true"
  [pagination]="pagination()"
  (pageChange)="onPageChange($event)"
  (sortChange)="onSortChange($event)"
/>
```

## Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `pageChange` | `number` | Emitido quando a página é alterada |
| `sortChange` | `{ key: string, direction: 'asc' \| 'desc' }` | Emitido quando a ordenação é alterada |

## Estilos CSS

O componente inclui estilos CSS completos que podem ser personalizados através de variáveis CSS:

```css
:root {
  --color-border: #e0e0e0;
  --color-background-secondary: #f8f9fa;
  --color-text-primary: #333;
  --color-primary: #007bff;
}
```

## Responsividade

- **Mobile**: Colunas se ajustam automaticamente
- **Desktop**: Larguras definidas são respeitadas
- **Breakpoints**: Suporte a diferentes tamanhos de tela

## Dicas de Uso

1. **Larguras consistentes**: Use larguras proporcionais para colunas relacionadas
2. **Colunas de ação**: Mantenha larguras fixas para colunas de ações
3. **Colunas de texto**: Use larguras flexíveis para conteúdo variável
4. **Performance**: Evite larguras muito pequenas que possam quebrar o layout
