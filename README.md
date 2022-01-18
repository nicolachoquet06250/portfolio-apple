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
  - [<span style="color: green">&check;</span>] Système de superposition des applications
  - [<span style="color: green">&check;</span>] Fonctionalité de fermeture / minification / maximisation d'une application
  - [<span style="color: green">&check;</span>] Fonctionnalité de déplacement d'une application
  - [<span style="color: green">&check;</span>] Fonctionnalité de redimentionnement d'une application
  - [<span style="color: gray"> ? </span>] Animation d'ouverture / fermeture / minification d'une application :
    - [<span style="color: red">&cross;</span>] Animation d'ouverture d'une application
    - [<span style="color: green">&check;</span>] Animation de fermeture d'une application
    - [<span style="color: green">&check;</span>] Animation de minimification d'une application
    - [<span style="color: green">&check;</span>] Animation de maximisation d'une application
  - [<span style="color: red">&cross;</span>] Applications à développer :
    - [<span style="color: red">&cross;</span>] Paramètres
    - [<span style="color: gray"> ? </span>] Finder
      - [<span style="color: gray"> ? </span>] Système d'arboraissence virtuelle pour pouvoir stocker des fichier sous forme base64 dans la base de données localDB du navigateur de sorte que les données des utilisateurs ne sortent pas de l'application
    - [<span style="color: red">&cross;</span>] Images
    - [<span style="color: red">&cross;</span>] Mails
    - [<span style="color: red">&cross;</span>] Messages
    - [<span style="color: red">&cross;</span>] Terminal
      - [<span style="color: red">&cross;</span>] Véritable interprétation de commandes bash
    - [<span style="color: red">&cross;</span>] Corbeille
      - Système de mise à la corbeille des fichiers que l'on veux supprimer
  - [<span style="color: gray"> ? </span>] Customiser le menu contextuel

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

### ANNEXES
- [FIGMA MacOS 11](https://www.figma.com/community/file/949158727443209284?preview=fullscreen)
- [FIGMA IOS 15](https://www.figma.com/community/file/984106517828363349?preview=fullscreen)
- [Generateur de clip-path](https://www.cssportal.com/css-clip-path-generator/)
- [Exemple de déplacement de fenêtre + redimentionnement avec VueJS](https://www.cssscript.com/material-macos-window-vtwindow/)
  - [Demo](https://www.cssscript.com/demo/material-macos-window-vtwindow/)
- [Effet corbeille MacOS](https://robertnyman.com/css3/css-transitions/css-transitions-mac-os-x-stacks.html)