# MÓDULO FORMATIVO 3 - Implantación

Denominación: IMPLANTACIÓN DE APLICACIONES WEB EN ENTORNOS
INTERNET, INTRANET Y EXTRANET.
Código: MF0493_3

Duración anterior: 90 horas (18 días)
Duración actual: 77 horas (15 días + 2h)

## Introducción (1 día)

1. Internet
2. La World Wide Web
3. Aplicaciones web
4. Documentación de aplicaciones web

Del módulo anterior

1. El proceso del desarrollo de software
   - ciclo de vida del software
   - agile: scrum
  
### Conocimientos prácticos

- Terminal, Linux y Windows
  - Git Bash: shell Linux (bash) para Windows
  - WSL: subsistema de Windows para Linux
    - Instalación de una distribución Linux (Ubuntu, Debian...) en Windows
    - Instalación de un shell: bash, zsh, fish... 
    - Comandos básicos de Linux: ls, cd, mkdir, rm, mv, cp, cat, echo, touch, find, grep...
    - Editores de texto en terminal: vim, nano, emacs...
  - Terminal de Windows: shell de Windows (cmd) o PowerShell (v.7) para Windows
    - Framework de shell en PowerShell: Oh My Posh
- Ubicación (despliegue en Internet): 
    - VPS (Virtual Private Server), 
    - hosting compartido, 
    - hosting dedicado, 
    - cloud (AWS, Azure, Google Cloud...)
- VPS: Virtual Private Server
  - Instalación del SO: Linux (Ubuntu, Debian...)
  - Seguridad y acceso remoto: user/password, SSH...
  - Servidor web + servidor de aplicaciones: Node.js básico
- Internet: 
  - Terminología: protocolos y puertos
    - HTTP, HTTPS, FTP, SSH. TCP/IP, UDP...
    - Puertos: 80, 443, 21, 22...
  - DNS: Domain Name System
    - Compra y configuración de un dominio: ejemplo.com
- Servidores Web
  - Servidores web específicos:  Nginx, Apache como proxy inverso para Node.js
  - Virtual Server. PM2 como gestor de procesos para Node.js
  - Seguridad: certificados SSL, HTTPS, firewall, ufw, permisos...
- Contenedores (Docker)

Temas que veremos

- Git
- Testing y documentación de aplicaciones web
- CI/CD

## Verificación de aplicaciones web: Testing (9 días)

- Pruebas unitarias
  - Vitest en el backend
- Pruebas de integración: test de componentes
  - Vitest + testing library en el frontend
  - Jasmine + Karma en Angular
- Pruebas end-to-end
  - SuperTest en el backend
  - Cypress en el frontend

## Control de versiones (2 días)

- Git: Ampliación de contenidos

## Desarrollo y despliegue de aplicaciones web (1 días)

- CI / CD

  - GitHub Actions

- Despliegue
  - Webs estáticas
    - GitHub Pages
    - Vercel
    - Netlify
  - Aplicaciones Node
    - Render
    - ¿Vercel?

## Exámenes - Finalización del módulo (2 día + 2h)
