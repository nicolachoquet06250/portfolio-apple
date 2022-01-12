# portfolio-apple
création d'un portfolio sous forme d'un system macos développé avec vue 3

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Dépendances

<table>
    <thead>
        <tr>
            <th>Package</th>
            <th>Lien</th>
            <th>Version</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>@vue/cli</td>
            <td>
                <a href="https://cli.vuejs.org/">
                    https://cli.vuejs.org/
                </a>
            </td>
            <td>4.5.13</td>
        </tr>
        <tr>
            <td>vue</td>
            <td>
                <a href="https://v3.vuejs.org/">
                    https://v3.vuejs.org/
                </a>
            </td>
            <td>3.2.0</td>
        </tr>
        <tr>
            <td>vue-router</td>
            <td>
                <a href="https://next.router.vuejs.org/">
                    https://next.router.vuejs.org/
                </a>
            </td>
            <td>4.0.0-0</td>
        </tr>
        <tr>
            <td>vuex</td>
            <td>
                <a href="https://next.vuex.vuejs.org/">
                    https://next.vuex.vuejs.org/
                </a>
            </td>
            <td>4.0.0-0</td>
        </tr>
        <tr>
            <td>@vueuse/core</td>
            <td>
                <a href="https://vueuse.org/">
                    https://vueuse.org/
                </a>
            </td>
            <td>7.5.3</td>
        </tr>
    </tbody>
</table>

### Objectifs

- [<span style="color: gray"> ? </span>] Mac OS :
  - [<span style="color: green">&check;</span>] Dock macOS
  - [<span style="color: green">&check;</span>] Bureau macOS
  - [<span style="color: green">&check;</span>] Fonctionnalité "Secouer pour trouver le curseur"
  - [<span style="color: green">&check;</span>] Barre de menus du bureau
  - [<span style="color: green">&check;</span>] Design d'une application
  - [<span style="color: gray"> ? </span>] Fonctionalité de fermeture / minification / maximisation d'une application
  - [<span style="color: red">&cross;</span>] Animation d'ouverture / fermeture / minification d'une application
  - [<span style="color: red">&cross;</span>] Applications à développer :
    - [<span style="color: red">&cross;</span>] Paramètres
    - [<span style="color: red">&cross;</span>] Finder
      - [<span style="color: red">&cross;</span>] Système d'arboraissence virtuelle pour pouvoir stocker des fichier sous forme base64 dans la base de données localDB du navigateur de sorte que les données des utilisateurs ne sortent pas de l'application
    - [<span style="color: red">&cross;</span>] Images
    - [<span style="color: red">&cross;</span>] Mails
    - [<span style="color: red">&cross;</span>] Messages
    - [<span style="color: red">&cross;</span>] Terminal
      - [<span style="color: red">&cross;</span>] Véritable interprétation de commandes bash
    - [<span style="color: red">&cross;</span>] Corbeille
      - Système de mise à la corbeille des fichiers que l'on veux supprimer
  - [<span style="color: red">&cross;</span>] Customiser le menu contextuel

- [<span style="color: red">&cross;</span>] IOS
  - [<span style="color: red">&cross;</span>] Barre d'applications
  - [<span style="color: red">&cross;</span>] Bureau IOS
  - [<span style="color: red">&cross;</span>] Ouverture / fermeture / mise en arrière plan d'une application
  - [<span style="color: red">&cross;</span>] Listing des applications en arrière plan
  - [<span style="color: red">&cross;</span>] Sortie d'arrière plan d'une application

#### **Legend**
- [<span style="color: red">&cross;</span>] not works 
- [<span style="color: green">&check;</span>] works 
- [<span style="color: gray"> ? </span>] in progress