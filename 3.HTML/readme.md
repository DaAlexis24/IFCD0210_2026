# HTML

ELABORACIÓN DE DOCUMENTOS WEB MEDIANTE LENGUAJES DE MARCAS
Código: UF1841
Duración: 60 horas (12 días)
Centro de Formación Digital Alcobendas

## Aplicaciones instaladas

1. Google Chrome
2. Git
3. Node (versión Current LTS, 22.11.0, Last 23.2.0)
4. Visual Studio Code

### Extensiones de Visual Studio Code

"Extensiones" incluidas por defecto

- HTML **Snippets** (deprecada la extension de Mohamed Abusaid)
- CSS intellisense
- html-css formatter
- emmet
- path intellisense

- HTML CSS Support (de ecmel) 23M
- Auto Rename Tag (de Jun Han) 20M
- Live Server (de Ritwick Dey) 53M
- Prettier (de Prettier) 51M
- CSS Peek (de Pranay Karani) 6M
- Live Share (de Microsoft) 18M

Opcionales

- Image Preview (de Kiss Tamás) 2M
- Peacock (de John Papa) for workspaces 3M

- Markdown All in One (de Yu Zhang) 9M
- markdownlint (de David Anson) 7M

- EditorConfig for VS Code
- ESLint (de Microsoft)
- Git Graph

- Code Spell Checker
- Spanish - Code Spell Checker
- Spanish Language Package

- vscode-icons (de VSCode Icons Team)
- Material Icon Theme (de Philipp Kief) 26M
- Dracula Theme

### Settings para el VSCode

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "editor.minimap.enabled": false
}
```

### Configuración de Git

```shell
git config --global user.name "Tu Nombre"
git config --global user.email "Tu correo"
git config --global core.editor "code --wait [--new-window]"
git config --global core.autocrlf false
git config --global core.ignorecase true
```

### editorconfig

```editorconfig

# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = false
insert_final_newline = false

[*.html]
indent_size = 2

[*.md]
indent_size = 2
```

## Introducción al HTML

- Referencias
- Definición: Hypertext Markup Language
- Contexto: Otros lenguajes de marcado (XML)

```xml
<libro>
  <titulo>Yo robot</titulo>
  <autor>Isaac Asimov</autor>
</libro>
```

```json
{
  "titulo": "Yo Robot",
  "autor": "Isaac Asimov"
}
```

- Origen -> Módulo 3. La Web
- Estándar: [W3C](https://www.w3.org/) / [WhatWG](https://whatwg.org/)

- Importancia

  - Estructura
  - SEO
  - Accesibilidad
  - Usabilidad (UX)
  - Performance

- Primer documento HTML. Elementos básicos

  - Estructura. Validación
  - Etiquetas. Case insensitive: minúsculas
  - Atributos. Universales o específicos
  - Comentarios
