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

[<span style="color: gray"> ? </span>] Mac OS :
 - [<span style="color: green">&check; </span>] Processus d'installation
   - [<span style="color: green">&check;</span>] Parcour visuel
   - [<span style="color: green">&check;</span>] Installation de l'arboraissence grâce à l'api javascript IndexedDB
 - [<span style="color: green;">&check;</span>] Ecran de connection
 - [<span style="color: green;">&check;</span>] Permettre à l'utilisateur d'installer le système après l'avoir passé
 - [<span style="color: green">&check;</span>] Dock macOS
 - [<span style="color: green">&check;</span>] Bureau macOS
 - [<span style="color: green">&check;</span>] Fonctionnalité "Secouer pour trouver le curseur"
 - [<span style="color: green">&check;</span>] Barre de menus du bureau
 - [<span style="color: green">&check;</span>] Design d'une application
 - [<span style="color: green">&check;</span>] Système de superposition des applications
 - [<span style="color: green">&check;</span>] Fonctionalité de fermeture / minification / maximisation d'une application
 - [<span style="color: green">&check;</span>] Fonctionnalité de déplacement d'une application
 - [<span style="color: green">&check;</span>] Fonctionnalité de redimentionnement d'une application
 - [<span style="color: green">&check;</span>] Animation d'ouverture / fermeture / minification d'une application :
   - [<span style="color: green">&check;</span>] Animation d'ouverture d'une application
   - [<span style="color: green">&check;</span>] Animation de fermeture d'une application
   - [<span style="color: green">&check;</span>] Animation de minimification d'une application
   - [<span style="color: green">&check;</span>] Animation de maximisation d'une application
 - [<span style="color: gray"> ? </span>] Fonctionnalité Spotlight
   - Ouvrir : **ctrl+f** / **ctrl+F** / **loupe**
   - Fermer : **clique à côté** / **touche Echape**
 - [<span style="color: green">&check;</span>] Hub de Paramétrage
 - [<span style="color: green">&check;</span>] Dark / Light mode
 - [<span style="color: red">&cross;</span>] Applications à développer :
   - [<span style="color: red">&cross;</span>] Paramètres
   - [<span style="color: gray"> ? </span>] Finder
     - [<span style="color: gray"> ? </span>] Système d'arboraissence virtuelle pour pouvoir stocker des fichier sous forme base64 dans la base de données localDB du navigateur de sorte que les données des utilisateurs ne sortent pas de l'application
   - [<span style="color: gray"> ? </span>] Photos
   - [<span style="color: red">&cross;</span>] Mails
   - [<span style="color: red">&cross;</span>] Messages
   - [<span style="color: red">&cross;</span>] Terminal
     - [<span style="color: red">&cross;</span>] Véritable interprétation de commandes bash
   - [<span style="color: red">&cross;</span>] Corbeille
   - [<span style="color: red">&cross;</span>] TextEdit
     - Edition de text brut
 - [<span style="color: gray"> ? </span>] Customiser le menu contextuel
     - [<span style="color: green">&check;</span>] Bureau
     - [<span style="color: gray"> ? </span>] Applications

[<span style="color: red">&cross;</span>] IOS
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
- [FIGMA **MacOS 11**](https://www.figma.com/community/file/949158727443209284?preview=fullscreen)
- [FIGMA **IOS 15**](https://www.figma.com/community/file/984106517828363349?preview=fullscreen)
- [Generateur de **clip-path**](https://www.cssportal.com/css-clip-path-generator/)
- [Exemple de déplacement de fenêtre + redimentionnement avec VueJS](https://www.cssscript.com/material-macos-window-vtwindow/)
  - [Demo](https://www.cssscript.com/demo/material-macos-window-vtwindow/)
- [Effet corbeille MacOS](https://robertnyman.com/css3/css-transitions/css-transitions-mac-os-x-stacks.html)
- [Pack d'icons MacOS](https://www.macosicongallery.com/)
- [Flouter un arrière plan](https://developer.mozilla.org/fr/docs/Web/CSS/backdrop-filter)
- [Ecrans d'installation MacOS Big Sur](https://www.tech2tech.fr/comment-installer-macos-big-sur-sur-vmware/)
- [Tutoriel sur l'utilisation de l'api JavaScript **IndexedDB**](https://www.ionos.fr/digitalguide/sites-internet/developpement-web/indexeddb/)
- [Design de Spotlight](https://i.redd.it/xxto4cxmhmb51.png)
- [Design du tooltype pour la batterie](https://cdn.mgig.fr/2020/06/mg-67e4b39c-ed2b-4796-b2dc-w656h478-sc.jpg)
- [Design tooltype de nom d'apps dans le dock](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEA4QDhAQDhAQDhAOEA4QEBAODhAQFhIXFxYSFhYZHiohGRsmHBYWIjMiJistMDAwGCA1OjUvOSovMC0BCgoKDw4PGRERGy0eHiAvLS8vLy8vLy8vLS8vLy8vLS8vLy8vLy8vLy8vLy8vLS8vLy8vLy8vLy8vLy0vLy0vLf/AABEIAKkBKwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAAAQIFAwQGB//EAEYQAAEDAQMHCAcFBgUFAAAAAAEAAgMRBBIhBRYxUVOS0gYTIkFhcZGjFDJygbGy0VJic6HBByMzQpPhFSRjg7M0VHSC8P/EABoBAAIDAQEAAAAAAAAAAAAAAAABAgMFBAb/xAA5EQACAQMBBAcGBAUFAAAAAAAAAQIDERIEBRMhMUFRUmGBkaEUFSJxwdEyM7HwBiMk4fEWQmJj0v/aAAwDAQACEQMRAD8A5pJCFp2NfIE0kIsGQ0JICB5DUlBNFguCE6pIsSuSQooRYeRJNQTvJBkSQo1RVFiVySVUgmiwXGiqSEWHkNNJCQ8gQmkgdxp1UapoHcEJIQPIkhFUVQSuNCKpIGmOqKpVQgeQyUVQhA8h1QkiqCVzAhJCmY9xoSQkO40JIQO40IQgLghCdUx5AhJNA8gQkmkPIAhCEWHkCdUNaSWtGlzgwd5NB8V20XJiyhoDmOkdTF5kkbU66NcAEm7Cc7HE1Tqu4zasmx82fiRm1Y9j5k/ElkLeHDoqu5zasex8ybiRm1Y9j5k3EldD3pwtU6ruM2rHsfMm4kZtWPYn+tNxouPenD1RVdxm1Y9if6s/Gnm1Y9j5s3Ei496cOCiq7fNqybE/1ZuJPNqybHzZuJFx704aqku3zbsmx82biUXcmrKQaRlp6nCWUkeLiEsgVY4pCnaoTHLJETXm3uZXXQ6VjqpFylcaEqoQO5OqFFCCWRKqSSEBkYapVSQpmVclVFVFFUBcaaSEh3HVFUqoQFx1QkiqB3GmoJ1QO5IFFVFCB3JJ1UEVQFzNZj+9i/Hi+dq9PXl9m/ixfjRf8jV6goSEzHK6jXEaQ0ke4Kl5KZadabKJZg2OVn8YAXWgFoex4r1FjmnxV3MKtcBpLXAeBXIMyHaRFZImsDWz2SGx28F7axsjobwoaOJaZWYfaGpRbIs38h8ozJBabRaQImR2oxxNDHc4Y3RxvibdxLnnnBgNasIstwOZM8l8XMAOmZLG+OVjT6puEVIPVStdCp7bkaZzbSWMdUZSZa4o2SCF0sTYImUa8HoOwdStMW9VaqcOTi5lrebJM/nIWRCO12sOknaHFxbg5wjpU3Te0nq0qKb5CTZasy3CWyufzsPMsEkjZopInhh0ODSKmpww68FKHLMLhIXc5DzMYlkbPFJC4RkHp0cMRgdCqILJaHMtLHQzS2d0DWx2W2zRuldJeq4Nka5xa27Sl51ajqGKLPDbQy0iATxM5gCCO1ywyyiepqWODnUbdoKuJxp1BF2NMtrHlmGVxYOcicI+epPE+G9EDi8XgKgYV1VCwRcpLM4xAGUCaRscL3QSsjmLjQFjiKEduo1VTFkyWSYvkjtMUJsVqgfJabSyWRr5LnSDWvIaKA6NN3ECgrCW0zSNyWxzYLrbXZrskUzZRMIwelG0DBt0FxqcNHai7DJl9acvQRvcxxkox7Y5JmxSOgiedDXyAXWnEd1RWidsy3DC57X86ebDTK+OGSWOEO0F7migwx7lQS5GlabTCYbTO2aaWRj47YIbK6OVxcRK29VpFSDRrq0r2LbytZJhJK6zQzxzuawRWmG0MEL3BoAM8b3DRoqGuJHWi47s6UHV/ZCTK0F6hdQXiMATTGiamWHnmWT/AJm0/jOWpVbOWv8AqbT+M5aimuRbCXAlVNQQmTuSqiqihRsGRNFUkJ2Hka1U6qF5FVIy7kqqVVCqKoHcmhQqnVIMh1TqogpXkDuSqnVQqiqB3J1RVQqpIC46p1WOqKoHcyVRVQvIqgdzLC+69jjiGSMfTrN1wP6L0+CdkjQ+Nwc1wqHA1C8sqoXQk0Fz1mqF5LcGoJ3BqCjiO56zVFV5LcbqHgpXBqCdgueshNeX5Nt77PI2SImgPSjqbj29YIXosOUInwicOAjul5cf5aaQe0JMdzZWrBk2CN7pI4IY5HVvSMjYx5rpqQKrgcs5UfaZHOcSIwaRxVNA3WR1uKr+bbqCMQPV6p1Xk9wagi43V+QRYkesVUZJGtBLnBrQKkkgALym4NXwTDRqRYLm7lKdsk80jfVfK5zTrFcCtdQBRVSTJKROqKqFU6p3HkTTqsdUVSHkSqmo1TqgeRrVSqugzej2su6xGb0e1l3WKeLM3I5+qAV0Obse1l3WfVLN6Pay7rEYsMihqlVX+b0e1l3WJ5ux7WXdYliwzOfqnVX+bse1l3GfVGbse1l3WIsxqZQVRVX+bse0l3WJ5ux7WXdYizHmc/VO8r/N2PaybrEZux7WXdYizDMoKovK/wA3Y9rJuMRm7HtZdxn1RZjzOfqnVdBm7HtZN1iWbse1l3WIsx5HPVTquhzdj2sm6xLN2PaybjPqlZjUjn6oqugzdj2su6z6ozdj2su6xFmGRz9UVXQZux7WXdYjN2Pay7rEWY8jn6qXOvulgc4RlwcYw43CddNCv83I9rJusRm7HtZd1n1RiwyKCqVV0Gbse1l3WfVA5Ox7WXdZ9UWY8kc/VSBV9m7HtZd1n1Tzdj2su6xFmPIoKoqr7N2PaybrE83Y9rJusRZhmUFUVXQZux7WXdZ9UZux7WXdZ9UWYZnP1RVdBm7HtZd1n1Rm9HtZN1iLMeZz9UVXQZvR7WXdYlm7HtZN1iLMMyhqiq6DN2PaybjPqo5ux7WTcZ9UWY8y1SQmr4xcnZGbOUYptjASoolyV5aEdHHpZmz182/hVjJRKihVFVP2SmQ9vq93kTonRY6p3lCWijbgyUNoTT+JJokhIJrPnFxdmasJqcVJAmhWlisTQA6QBzjjdOhvu1rl1OphQjlLpKtRqoUI5S6eoq6JhdCKDQGD/wBQnX2PBZvvldj1Rm++l2PU52iKLoq+wivs+CS2yux6h76/4ev9jnULoHBp0tYe9oKrrdZA0X2YD+ZumnaF0afadOpJQaxbOnTbVhVkoNYt8uVjQQkmtI1bgnRb+T7EH9N+La4N0V7+xWrGNGDWsHcAs7U7ShSlildoy9TtWnSlglk14I5uiVF0+GpvgEXu7dXN74XY9Tn99rseqOZohdNXsb4JEA6Q0+4I98Lseoe+12PVfY5qqFb22wNcCWANcMaDQ73a1ULS0+qhXjeJqaXVw1Eco9HNAhJDnUXSlfgjoqVIwi5S5IadFiadePesgPculaV9LMGf8QRT+GDa+dg9yPcp+CPBP2XvK/8AUX/X6r/yQohBPcsZOr+yT0r6GWU/4gi38VNpdz/sZEXkmOqmuZq3M34TjOKlF3TMag8rIsL3YldmiV5syNe3gl1sKp1VrySyfHaLS2OUFzBG95aCRUigAqOrFd7mnYtgN+T6qzU7Qp0J4STb7jko6WVSOSseWVReXqWadh2A35PqtPKPIyzPY7mWmGSnRcHuLa6iCTgqY7Xot8U15fcsegqJc0edXkqq1yFkCW1SObQxxscWySEaHDS1utyz8sclRWWSFkQcA6K8684uJcHUqu32unvVSTu3/k5tzPDPoKWMrLVazDiFnK5tcviTO/Zz+GSMkQq5o+80fmrsPVJB67PbZ8ysw6paNFXXfE0Xk9s3zgu76nFthtzgu76mfnBralzo1tXe2GwxxtAa1oAGrE9pK2uZbqH5LkWhfaJR2O2rufoecc4NbfFO+vQ32dhFCGnspVcVlXJx9J5mBtbzGyU0NYDUGuoVCrq6WUFdO5z6nZs6UU08uNjSvrHOateNcTvgV0NsyKyGzSPd0pGsLr+jEHqHUFzBfgfwz8Cq5U3SlG/czmraedCUVLm+PqVqAkmF7K3E9l0l5Z3UYwfdb8qzwtc9wawFzjoAWix/Rb+Gz5Qu05N2ERxNkcOnIA6vWGnQPBePhTdWo/G/meQ02neoqtXsuLfmYLHydqAZnmv2WaPFb4yDZ6eoT2331+K3zJRR59aMaFOKtY9BDR0IKyiiptPJ1hB5tzmHqqS5v5rn7bZZIXUkGnQ4eqV2hnWnb42StLH6CMD1g9RCpraeDV48Gc2q2fSnFuCxl6HH84qS0ij3j/Uf8xVpJVri12lpunvGCq7Sem/2nfMrNj/mT+X1ObYztUmu76mJY5Tj7j8VkWC0HEeyfivTaZfzEaG1n/Sy8P1G0rICtdrlMFadjxzidTkLIcdps0j2vIna5wAqAxpA6II7dajyhyNFZYYiXuMz3AOFei7DGg6qLZ/Z/ZHN5+0vcWx0uBugOLTUuPdo95VZykdLPdtumBz3wQ0rg1ppfPtEO8BrWSqk/anHL4U/XsmzKhTWkU8Pia9E/wARTkrG46e5IuWNzlrWMdIzwnE9zVlqtezHE9wWdZmoVqjPZ7Kf9LDx/UxrWkOJ71slacp6R711aFfFL99Jza78MfmzqP2en/O/7EnzNXpwXjXJvKgstojlcCWAOY8DTcd1juIBXqUOXrI8BzbTDQ65GtPvBxCzdrUp77K3BpehZoZxwtfjctElo/4xZv8AuYP6sf1UX5ZswBJtEGGP8Vn1WW6c+y/I7c49Zq8lQOYd/wCVav8AneuT/aUf38H4B+da2Q+Vhs80rXAyWeSeR+A6bLzib7dY1j/4w5e5RhnmgdDI2RogxLTUAl5IB7exbWn01SnrE5Lg7u/gZ1WtGenaT4o55hxC21osOIW8u3aHOIbP5SJRes322/MtuOTps9sfMFps0jvb8ym6ShB1OveBqvH7Y/Nh8vqcW1n/ADYfL6npkdsoFP01cqzKPXWrTi1wxBHYn/iY7fAoVaNjWWqg+k6g21VXpoFqmd/oRfPKqs5S1VJ7lRW/Kjmz32UcBG2ORhODsSSK9RFdKrqaiKKK+shGz7/uddljKIdBK2ulhXIh+B7j8Cpy2kPje5jxdLSCxxAe0n+UhagdgfYPwXJXq5yizI19dVZxa/fEgUBIlML1/Sepubhf0P8AbHyr0yCdpijc3QWNI1UIwXlrXYD2G/ALpOTeVxdFmkNHNwiJ0Ob9nvHwXktPVxnJPp+55rZuoVOrKL/3fc6SW0LHz605nFYDaF153NvO5YunWIz1K0ecJ0LBlC3izsqaGRw/ds6ydZ7FCdSyKqtdRjdlTlOWs0tPtge8NAP5gqqlPSd7TvmUw49ZqSak6ydJWN5xPe74qzY7vVm+76mdsiWVeb619SK1bYaEdx+K2qrQyk6jh3fqvUaX81GntNX08vD9RB63MmWZ080cUXrSGldN1ulzj3BT5M5Ys9mke60QiUOaA0lofcIJrgdeGPYuwPKqzwMbN6FLEx4FyUWcsa4HR0qdeCv1OpqU24xh8nfp+Rh6fRwmlKUkutdxj5bZRZZbPFYoTdLm3TQ4tjGkntP6nUjkVaYrVY5LDJSsYLQBpuOJLXDtB+CwycurA8lz7Pfdoq6G8fEhaFt5X2QPils0JimjeAS2Pmw+InpsOvDEdoWaqM3SUN2073v39ZpOcN7vM042tj3FHb4HQyyQyYPjcWnqB1OHYRQ+9ajnr1jKdts4s/ppiZPHca9zgxsjrh0O7sfBea8pMrQWiVr7PFzTQy67ohl81wNOz9Vo6TWSrOzg1bm+i/yM/U6GNLipJ9S7jBYjUnuC21oZNdUu7gt5Uar8x+BubN4aePj+pBaVowcVurFaIrww0hWaWooT48mVamm5w4c0aVU6qBw0oJW2u4ySVUVSvJVRYCVUVUbyAUrDM0GLgt9YLLFTE6fgs6xtZUU58OSNXSU3CHHpAn9PiovKkQsF6mB8da8ztihKSjUir2vc4Nr0pPGolwXBkem31HvZ2Ne5g/Io5yXazf1ZPqp1QsHMxlVfWQvyHAyynvkef1U2MACVexOqTkKVRvpC4K1ost6lfZKxXk2G8cNHWVfpqUq1RRj1lmnpSrVFFceKv3IzFMFJC9mezuAfgO4fBJ5B0rG83Tjo6j4IvLxuqoypVZJ+B43U0ZUqkovrfkdKcuMghijv+kzNBvFrqtqSeiX9gw660WAcpgfWs5r2SCnwVAD2BOqrdd34FktdU6OBcT8oZnVETGQ/eP7x3uqAPyKrC8lxc9xe86XuNSVivovKEqjfSc9SvOf4mZryCev7zvite/XAafgs63dj0JRym+Cdkja2NRkspvk+H3BVuWDRzO0Efn/dWS08pWcyNw9YYhei088KibNXVU3UpOKKtkgq0uF5oc0ubovNrUt94XU8ruVzbXHFBAHMiFHSVbcrT1WAauv3BcY6oNHAgjqKbXrUnp4VJRm+NuRhxlKEZRXC/M2QgrDziOcV+CKcTruSnLBlmgks9pa6SMh3N0F/ou9aM9mmnfRcpfGNMBjQaaDqCwuekyrjRoJOpc9PTQpSlNcL8y6UpTUYvjbkXGR3VL+5o+Ks1q5Os3NsodJxPetpZdealUbRu6WG7pRiyKSSFWIhJE12ke/rWI2NusrYqiqthXqR4JlUqMJc0a/of3j4JehD7R8FtIVntdXtEfZqfUawsbdZWWOFrdA95xKyIUJV6klZslGjTjxSBNJCqLrjqk4A6cUk0DIc03t3inzbfvbzlNCrdOPUvJEcI9S8kQ5oa3bzkc037285TTS3ceyvJD3cepeRjELdRPeVkA1YIQpJW5cCSSXIEkITJ3AhQ5puo+KmhJxT5q5FpPgyHND728U+ab97ecpoUd3DqXkhbuHUvJGPmm/e3nI5pvbvFZEI3cepeQ93DqXkhNAGgUTQhTJiTQhAGKSFrvWaCoehx/YHgthCabQnFPmjX9Dj+yPBHocf2R4BbCEZS62LCPUvI1/Q4/sDwCyRwtb6oA9yyIQ23zY0kuSsCdEklEkcznJJsofN4k85ZNlD5vEqRIJHBky8zll2UPm8SM5JdlF5vEqVRQPJl5nJLsovN4kZyy7KHzeJUaEBky9zll2UPm8SWcsmyh83iVGpBAZMus5ZdlD5vEjOWTZQ+bxKkQgMmXeckmyi83iRnJJsofN4lSKSAUmXOckmyh83iRnJJsofN4lSJoHmy7zlk2UPm8SM5ZdlD5vEqRNA82XWcsuyh83iRnLLsofN4lTISDNlznLLsofN4k85ZdlD5vEqVCB5sus5ZNlD5nEjOWTZQ+bxKkKaA3jLvOWXZQ+bxJZyy7KHzOJUaaB5Mus5ZdlD5vEnnLLsofM4lSBNAZyLnOWXZQ+bxIzll2UPm8SpShAZsus5ZdlD5vEjOWXZQ+bxKlTQGbLnOWXZQ+bxIzll2UPm8SpkkBky6zll2UPm8SM5ZdlD5vEqVNAnNl1nLJsofN4kZyy7KHzeJUqEBvJFznLLsofM4k85ZdlD5vEqVCA3kj//2Q==)