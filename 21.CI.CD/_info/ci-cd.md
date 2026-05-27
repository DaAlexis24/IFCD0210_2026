# CI/CD: Continuous Integration and Continuous Deployment

La **integración continua** (CI) y la **entrega continua (delivery)** / **despliegue continuo (deployment)** (CD) son prácticas de desarrollo de software que permiten automatizar la **construcción**, las **pruebas** y el **despliegue a producción** de aplicaciones de forma rápida y segura. Estas prácticas permiten a los equipos de desarrollo y operaciones colaborar de manera más eficiente y entregar software de alta calidad de forma más rápida y predecible.

Los servicios de CI/CD salvan las distancias entre las actividades y los equipos de desarrollo y operación, al imponer la automatización en la construcción, las pruebas y el despliegue de las aplicaciones, en el marco de los procesos conocidos como DevOps.

La **integración continua** (CI) es una práctica de desarrollo de software en la que los miembros de un equipo integran su trabajo con frecuencia en un repositorio, incluso varias veces al día. Cada integración se verifica mediante la **construcción automatizada** y las **pruebas unitarias**, lo que permite detectar errores rápidamente y corregirlos antes de que se conviertan en problemas mayores.

Una primera etapa de este proceso puede tener lugar a **nivel local**, en el equipo de cada desarrollador, vinculado al proceso de creación de los commits. En este caso, se pueden utilizar herramientas como **Husky** para ejecutar pruebas unitarias y de estilo de código antes de realizar un commit, o **Lint-staged** para ejecutar pruebas de estilo de código en los archivos que se han modificado.

Los estilos de código, generalmente aceptados por la comunidad o consensuados a nivel de equipo, pueden quedar
definidos en archivos de configuración como `.eslintrc` o `.prettierrc`, y pueden ser verificados automáticamente con herramientas como **ESLint** o **Prettier**. Aunque estas herramientas disponen de plugins que permiten su integración en el IDE (por ejemplo, **VSCode**), también pueden ser configuradas para que se ejecuten automáticamente en cada commit, o en un paso previo a la integración continua, por ejemplo utilizando Husky.

Una vez que el código ha sido integrado en el repositorio, se puede proceder a la **integración continua** propiamente dicha, a **nivel del servidor de integración continua**. En este servidor, se ejecutan las pruebas de integración, las pruebas de regresión y las pruebas de aceptación, y se generan los artefactos de construcción que se utilizarán en el despliegue a producción.

La **entrega continua** (CD) es una extensión de la integración continua que automatiza el despliegue de software en entornos de prueba y producción. Con la entrega continua, cada cambio en el código se despliega automáticamente en un entorno de prueba, donde se ejecutan pruebas automatizadas para verificar su funcionamiento. Si las pruebas son exitosas, el cambio se despliega automáticamente en producción, lo que permite a los equipos de desarrollo entregar software de alta calidad de forma rápida y segura.

![CI/CD Flow](ci.cd.png)

## Integración continua a nivel local

### Análisis estático de código: ESLint y Prettier

Un primer nivel de análisis y corrección de errores en el código fuente se puede realizar a nivel local, en el equipo de cada desarrollador, utilizando herramientas como [**ESLint**](https://eslint.org/) y [**Prettier**](https://prettier.io/).

**Prettier** es una herramienta de formateo de código para JavaScript que permite aplicar un estilo de código consistente y legible en todo el proyecto. Se define a si misma como "opinionated code formatter". es decir un formateador de código con opiniones, que se basa en una serie de reglas predefinidas y que no recomienda la personalización de las mismas, aunque si lo permite.

**ESLint** es un "linter" de código, una herramienta de análisis estático de código para JavaScript que permite identificar y corregir errores de sintaxis, errores de estilo y errores de lógica en el código fuente. Podría entenderse como un paso más allá de Prettier, y también permite la personalización de las reglas de estilo y la definición de reglas de calidad de código.

Prettier y ESLint disponen de plugins que facilitan su integración en el IDE (por ejemplo, VSCode), se pueden ejecutar desde linea de comandos y también pueden ser configurados para que se ejecuten automáticamente en cada commit, o en un paso previo a la integración continua, por ejemplo utilizando Husky.

### Instalación y configuración de Prettier

Para instalar Prettier en un proyecto, se pueden ejecutar los siguientes comandos:

```sh
npm install -D prettier
```

Para configurar Prettier, se puede crear un archivo de configuración `.prettierrc` en el directorio raíz del proyecto, que contiene la configuración de Prettier para el proyecto.

Como en otros casos casos, el fichero de configuración pueden sustituirse por configuraciones añadidas en el archivo `package.json` del proyecto, en la sección `prettier`.

Por ejemplo, para modificar los valores por defecto de Prettier para que formatee el código de JS/TS utilizando comillas simples y sin punto y coma al final de las líneas, se puede añadir la siguiente configuración en el archivo `package.json`:

```json
// package.json
  "prettier": {
    "singleQuote": true,
    "semi": false
  }
```

### Instalación y configuración de ESLint

A la hora de utilizar ESLint en un proyecto, hay que tener en cuenta los cambios introducidos en la versión 9.x, que han simplificado la instalación y configuración de ESLint en un proyecto, pero provocando serios problemas de retrocompatibilidad con las versiones anteriores.

Hasta la versión 9, para instalar ESLint en un proyecto, se solía ejecutar el siguiente comando:

```sh
npm install -D eslint
```

A continuación, se puede configurar ESLint ejecutando el siguiente comando:

```sh
npx eslint --init
```

Las nuevas versiones 9.x proporciona un comando que combina la instalación y la configuración en un solo paso, por lo que se puede ejecutar el siguiente comando:

```sh
npm init @eslint/config@latest
```

En cualquiera de los dos casos la configuración se hace mediante un asistente que permite seleccionar las características de ESLint en el proyecto. En las versiones previas a la 9.x esto incluía el conjunto de reglas de estilo, mientras que en las versiones 9.x se selecciona un conjunto de reglas predefinidas, como `pluginJs.configs.recommended`.

Como consecuencia se crea un archivo de configuración `.eslintrc` o `eslint.config.mjs` en el directorio raíz del proyecto, que contiene la configuración de ESLint para el proyecto.

Si se utilizan ambos, Prettier y ESLint, en un proyecto, es recomendable instalar el plugin `eslint-config-prettier` y añadirlo a la configuración de ESLint, para que ESLint no aplique reglas que entren en conflicto con Prettier.

```sh
npm install -D eslint-config-prettier
```

En ESLInt previo a la versión 9.x, se añade a la configuración de ESLint en el archivo `.eslintrc`, como último de los extends:

```json
// .eslintrc
{
  "extends": ["eslint:recommended", "prettier"]
}
```

En ESLint versión 9.x, se añade a la configuración de ESLint en el archivo `eslint.config.mjs`, también en último lugar:

```js
// .eslint.config.js
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
```

### Husky

[Husky](https://typicode.github.io/husky/) es una herramienta que permite ejecutar scripts de cualquier lenguaje de scripting (por ejemplo Node.js) en respuesta a eventos de Git. Para ello se aprovechan los [**hooks** de Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), que son scripts que en función de su nombre, se ejecutan automáticamente en respuesta a eventos específicos, como `pre-commit`, `prepare-commit-msg`, `commit-msg` y `post-merge`.

Husky puede utilizarse para ejecutar pruebas unitarias y de estilo de código antes de realizar un commit, o para ejecutar pruebas de estilo de código en los archivos que se han modificado.

### Instalación y configuración de Husky

Para instalar Husky en un proyecto, se puede ejecutar el siguiente comando:

```sh
npm install -D husky
```

A continuación, se puede configurar Husky ejecutando el siguiente comando:

```sh
npx husky init
```

Como consecuencia de crea un script `pre-commit` y se añade o se actualiza en el archivo `package.json` el script `prepare`:

```json
// package.json
  "scripts": {
    "test": "node --test",
    "prepare": "husky"
  }
```

```script
// .husky/pre-commit
npm test
```

En este caso, el script `pre-commit` ejecuta el script `test` definido en el archivo `package.json`.
El valor por defecto de ese script, en lugar de ejecutar las pruebas unitarias, incluye un mensaje y un código de salida.

```json
// package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

Si el código de salida es 1, estamos simulando un error en las pruebas unitarias, lo que provocará que Husky impida que el commit se realice. De esta forma podemos comp`robar fácilmente el correcto funcionamiento de Husky.

### Ejemplos de scrips para Husky

Para el hook commit-msg, podemos forzar que el mensaje del commit tenga una longitud entre 10 y 72 caracteres, mediante el siguiente script:

```sh
// .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

while read line; do
    # Skip comments
    if [ "${line:0:1}" == "#" ]; then
        continue
    fi
    if [ ${#line} -ge 72 ] || [ ${#line} -le 10 ]; then
        echo -e "\033[0;31mThe length of the message has to be between 10 and 72 characters."
        exit 1
    fi
done < "${1}"

exit 0
```

Para el hook pre-commit, podemos forzar que se ejecute un script de linting antes de cada commit, mediante el siguiente script:

```sh
// .husky/pre-commit
npm run lint
```

Para el hook pre-push, podemos forzar que el nombre de la rama cumpla con un patrón específico, mediante el siguiente script:

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

valid_branch_regex='^((hotfix|bugfix|feature)\/[a-zA-Z0-9\-]+)$'

message="Please check your branch name."

if [[ ! $local_branch_name =~ $valid_branch_regex ]]; then
    echo -e "\033[0;31m$message"
    exit 1
fi

exit 0
```

Para el hook post-merge, podemos forzar que se ejecute un script específico después de cada merge, mediante el siguiente script:

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run post-merge
```

En el ejemplo del pre-push, al comprueba que el nombre de la rama cumpla con un patrón específico, indirectamente estamos protegiendo la rama `main` o `master` de cambios directos, ya que el nombre de la rama no cumplirá con el patrón. Los cambios en estas rama quedarían restringidos al uso de **pull requests (PR)**, que permiten revisar los cambios antes de integrarlos en la rama principal.

Sin embargo tenemos que tener en cuenta que los hooks de Git son scripts que se ejecutan en el equipo de cada desarrollador, por lo que pueden ser modificados por los desarrolladores o deshabilitados añadiendo a la ejecución de los comandos de git el modificador `--no-verify` o `-n`.

Además, nada garantiza que los hooks de Git se compartan en todos los miembros del equipo. Por todo ello, Husky no es una solución definitiva para garantizar la calidad del código. Para ello, es necesario implementar un sistema de integración continua y entrega continua a nivel del servidor de integración continua.

## Herramientas de CI/CD a nivel servidor

Existen muchas herramientas que permiten implementar un servidor CI/CD en un proyecto, algunas de las más populares son:

- **Jenkins**: Es una herramienta de automatización de código abierto que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones.
- **Travis CI**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones.
- **CircleCI**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones.

Otros servicios de CI/CD vinculados a plataformas concretas de hosting de repositorios y aplicaciones son:

- **GitHub Actions**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones directamente desde GitHub.
- **GitLab CI/CD**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones directamente desde GitLab.
- **AWS CodePipeline**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones en AWS.
- **Azure DevOps**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones en Azure.
- **Google Cloud Build**: Es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones en Google Cloud.
- **Bamboo**: Es una herramienta de integración continua y entrega continua de Atlassian que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones.

En definitiva, todas estas herramientas lo que proporcionan es un entorno virtualizado () en el que se ejecutan los scripts de construcción, pruebas y despliegue de la aplicación, y que se configura para que se ejecute automáticamente en respuesta a eventos específicos, como la integración de código en un repositorio o la creación de una solicitud de extracción.

## GitHub Actions

[GitHub Actions](https://docs.github.com/es/actions) es un servicio de integración continua basado en la nube que permite a los equipos de desarrollo automatizar la construcción, las pruebas y el despliegue de aplicaciones directamente desde GitHub. GitHub Actions se basa en el uso de **workflows**, que son archivos de configuración que definen las acciones que se deben ejecutar en respuesta a eventos específicos, como la integración de código en un repositorio o la creación de una solicitud de extracción.

Estos workflows se definen en archivos YAML que se almacenan en el directorio `.github/workflows` del repositorio, y se pueden configurar para que se ejecuten automáticamente en respuesta a eventos específicos, como la integración de código en un repositorio o la creación de una solicitud de extracción. El formato YAML es un formato de serialización de datos que es fácil de leer y escribir para los humanos, y que es fácil de procesar para las máquinas. Se basa en la indentación y en la estructura de clave-valor, y se utiliza en muchos lenguajes de programación y herramientas de configuración. Es muy recomendable algún plugin de VSCode para YAML, preferiblemente la creada por RedHat, considerada en la práctica como la extensión oficial.

Los elementos básicos de un workflow de GitHub Actions son:

- **Name**: El nombre del workflow.
- **On**: El evento que desencadena el workflow (por ejemplo pull_request, push) y en que rama (generalmente main o master).
- **Jobs**: Los trabajos que se deben ejecutar en el workflow.

Cada trabajo puede contener los siguientes elementos:

- **Name**: El nombre del trabajo.
- **Runs-on**: El sistema operativo en el que se debe ejecutar el trabajo (por ejemplo ubuntu-latest).
- **Steps**: Los pasos que se deben ejecutar en el trabajo.

Por su parte los steps pueden contener los siguientes elementos:

- **Name**: El nombre del paso (opcional).
- **Run**: El comando que se debe ejecutar en el paso.
- **Uses**: La acción pre-configurada que se debe ejecutar en el paso.

Las acciones se pueden componer de otras acciones y GitHub tiene un marketplace con muchas acciones pre-configuradas que se pueden utilizar en los workflows.

Generalmente una de las primeras acciones que se ejecutan en un workflow es la de checkout, que permite clonar el repositorio en el que se está ejecutando el workflow.
Para ello disponemos de la acción `actions/checkout@v4` que podemos localizar en el marketplace como un repositorio de GitHub [actions/checkout](https://github.com/actions/checkout) con el código de la propia acción y la documentación sobre su uso.

El siguiente paso es muchas veces instalar una versión concreta de Node.js, para lo cual disponemos de la acción `actions/setup-node@v4` que podemos localizar en el marketplace como un repositorio de GitHub [actions/setup-node](https://github.com/actions/setup-node). En este caso la versión de Node la guardamos como una variable de entorno en el archivo de configuración del workflow, mediante la strategy matrix.

## Ejemplo de configuración de CI/CD con GitHub Actions

A continuación se muestra un ejemplo de configuración de CI/CD con GitHub Actions para un proyecto de Node.js.
Después de las etapas ya indicadas de checkout y setup de Node.js

- se instalan las dependencias del proyecto con `npm ci`
- se ejecuta el script de npm responsable de las pruebas de estilo de código con `npm run lint`.
- se ejecutan el script de npm responsable las pruebas unitarias con su coverage con `npm test`

Evidentemente se da por hecho que existen los scripts `lint` y `test` en el archivo `package.json` del proyecto y que su funcionamiento es correcto en el entorno local.

```yaml
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test with coverage
        run: npm test
```

Cada etapa del workflow puede terminar con un código de salida 0, indicando que la etapa se ha ejecutado correctamente, o con un código de salida distinto de 0, generalmente 1, indicando que la etapa ha fallado. En caso de que una etapa falle, el workflow se detiene y se muestra un mensaje de error en la interfaz de GitHub Actions, al tiempo que se impide el proceso que disparo el evento, por ejemplo un push o una pull request.

Los scripts de package.json pueden ser tan simples como:

```json
"scripts": {
  "lint": "eslint .",
  "test": "jest --coverage"
}
```

Es importante que no incluyan comandos interactivos, ya que los workflows de GitHub Actions se ejecutan en un entorno virtualizado y no permiten la interacción con la consola. De la misma forma hay que evitar modificadores de tipo `--watch` que harían que el script no termine nunca.

## CD: Despliegue continuo

La etapa correspondiente a la **entrega continua** (CD) es responsable de automatizar el despliegue de software en entornos de prueba y producción y también se puede implementar con una step de las GitHub Actions.

Su contenido exacto dependerá del destino de el despliegue. Cuando se trata de empresas que proporcionan servicios de hosting, como Render, Netlify, Vercel, AWS, Azure, Google Cloud, etc., suelen proporcionar acciones pre-configuradas que se pueden utilizar en los workflows de GitHub Actions.

Por ejemplo, para el caso de [Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel), se puede utilizar el siguiente código en el workflow de GitHub Actions:

```yaml
name: Vercel Preview Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches-ignore:
      - main
jobs:
  Deploy-Preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

Los **secrets** que aparecen en el código del workflow de GitHub Actions los proporcionas nuestra cuenta de Vercel y se definen en la interfaz de GitHub Actions, en la sección de configuración del repositorio, y se utilizan para almacenar información sensible, como tokens de acceso a servicios de hosting.

Otra posibilidad es desplegar en un servidor propio, para lo cual se puede utilizar la acción `appleboy/ssh-action@master` , basada en el uso de SSH y que se puede localizar en el marketplace como un repositorio de GitHub [appleboy/ssh-action](https://github.com/appleboy/ssh-action).

Finalmente, en los servidores comerciales que antes hemos mencionado suele existir la posibilidad de que sean ellos los que ejecuten un runner y estén pendientes de los cambios en el repositorio y se encarguen de desplegar la aplicación en el servidor, por lo que no es necesario configurar un workflow de GitHub Actions para el despliegue.

## Ejercicios

Puedes aplicar los conocimientos adquiridos en este tema realizando los siguientes ejercicios:

1. Instala Prettier y ESLint en un proyecto y configura las reglas de estilo de código en los archivos `.prettierrc` y `.eslintrc`.
2. Instala Husky en un proyecto y configura los hooks de Git adecuados mediante Husky, para que el mensaje de los commits tenga una longitud entre 10 y 72 caracteres y para que las ramas cumplan con un patrón específico. Indirectamente, protegerás la rama `main` de cambios directos.
3. Comprueba de que tu proyecto pasa las pruebas unitarias y de estilo de código en tu entorno local.
4. Asegúrate de que tu proyecto es un repositorio de Git que esta enlazado con un repositorio de GitHub y protege la rama `main` de cambios directos.
5. Añade un workflow de GitHub Actions a un proyecto que ejecute las pruebas unitarias y de estilo de código en respuesta a eventos específicos, como la integración de código en un repositorio (push) o la creación de una pull request.

Puedes hacer todas estas operaciones tanto en un proyecto de backend con Nodo.js como en un proyecto de frontend, que en nuestro caso hemos aprendido a crear con React.js.

## Referencias

VIDEO: [GitHub Actions TUTORIAL Desde Cero - Integración continua (CI/CD) gratis y fácil](https://www.youtube.com/watch?v=sIhm4YOMK6Q) por Midudev
VIDEO: [LIVE de Github Actions para principiantes](https://www.youtube.com/watch?v=azzRDem_p5k) por Fastz Code

- [Husky](https://typicode.github.io/husky/)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [GitHub Actions](https://docs.github.com/es/actions)
- [¿Qué es CI/CD?](https://unity.com/es/topics/what-is-ci-cd)
