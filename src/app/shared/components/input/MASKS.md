# Máscaras para o Componente Input

O componente input agora suporta máscaras usando ngx-mask. Aqui estão as máscaras mais comuns e como utilizá-las.

## 🎯 **Propriedades de Máscara**

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `mask` | `string \| null` | `undefined` | Máscara a ser aplicada |
| `showMaskTyped` | `boolean \| null` | `false` | Mostra a máscara enquanto digita |
| `dropSpecialCharacters` | `boolean \| string[] \| readonly string[] \| null` | `true` | Remove caracteres especiais |

## 📱 **Máscaras Comuns**

### **Telefone**
```html
<!-- Telefone com DDD -->
<app-input
  label="Telefone"
  type="tel"
  placeholder="(00) 00000-0000"
  formControlName="phone"
  mask="(00) 00000-0000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>

<!-- Telefone fixo -->
<app-input
  label="Telefone Fixo"
  type="tel"
  placeholder="(00) 0000-0000"
  formControlName="phone"
  mask="(00) 0000-0000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **CPF**
```html
<app-input
  label="CPF"
  type="text"
  placeholder="000.000.000-00"
  formControlName="cpf"
  mask="000.000.000-00"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **CNPJ**
```html
<app-input
  label="CNPJ"
  type="text"
  placeholder="00.000.000/0000-00"
  formControlName="cnpj"
  mask="00.000.000/0000-00"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **CEP**
```html
<app-input
  label="CEP"
  type="text"
  placeholder="00000-000"
  formControlName="cep"
  mask="00000-000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **Data**
```html
<app-input
  label="Data de Nascimento"
  type="text"
  placeholder="00/00/0000"
  formControlName="birthDate"
  mask="00/00/0000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **Hora**
```html
<app-input
  label="Horário"
  type="text"
  placeholder="00:00"
  formControlName="time"
  mask="00:00"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **Moeda**
```html
<app-input
  label="Valor"
  type="text"
  placeholder="R$ 0,00"
  formControlName="value"
  mask="separator.2"
  [maskOptions]="{ separator: ',', decimal: '.' }"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **Cartão de Crédito**
```html
<app-input
  label="Número do Cartão"
  type="text"
  placeholder="0000 0000 0000 0000"
  formControlName="cardNumber"
  mask="0000 0000 0000 0000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

## 🔧 **Configurações Recomendadas**

### **Para Campos de Identificação (CPF, CNPJ, etc.)**
```html
[showMaskTyped]="true"
[dropSpecialCharacters]="false"
```

### **Para Campos de Contato (Telefone, CEP)**
```html
[showMaskTyped]="true"
[dropSpecialCharacters]="false"
```

### **Para Campos de Data/Hora**
```html
[showMaskTyped]="true"
[dropSpecialCharacters]="false"
```

## 📝 **Exemplos de Uso no User-Modal**

### **Campo de Telefone**
```html
<app-input
  id="phone"
  label="Telefone"
  type="tel"
  placeholder="(00) 00000-0000"
  formControlName="phone"
  [required]="true"
  mask="(00) 00000-0000"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

### **Campo de CPF**
```html
<app-input
  id="cpf"
  label="CPF"
  type="text"
  placeholder="000.000.000-00"
  formControlName="cpf"
  [required]="true"
  [error]="!!(form.get('cpf')?.errors && form.get('cpf')?.touched)"
  mask="000.000.000-00"
  [showMaskTyped]="true"
  [dropSpecialCharacters]="false"
/>
```

## 🎨 **Características das Máscaras**

- **Formatação automática**: Aplica a máscara conforme o usuário digita
- **Validação visual**: Mostra o formato esperado no placeholder
- **Caracteres especiais**: Pode manter ou remover caracteres especiais
- **Flexibilidade**: Suporta diferentes tipos de máscaras
- **Integração**: Funciona perfeitamente com Reactive Forms

## 🚀 **Vantagens**

1. **UX melhorada**: Usuário vê o formato esperado
2. **Validação visual**: Formato correto é aplicado automaticamente
3. **Consistência**: Padrão uniforme em todo o sistema
4. **Acessibilidade**: Placeholder mostra o formato esperado
5. **Integração**: Funciona com validação de formulários
