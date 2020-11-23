const TranslationsMap = {
    en: 'English',
    es: 'Español',
    de: 'Deutsche',
    ar: 'العربية',
    ja: '日本語',
}

window.onload = function() {
    let languageSelect = document.getElementById("language-select");

    let i = 1;
    for (var x in TranslationsMap) {
      languageSelect[i] = new Option(TranslationsMap[x], x);
      i++;
    }

    languageSelect.onchange = function() {
        let languageSelect = document.getElementById("language-select").value
        fetch('/user/updateLang', {
            method: "PUT",
            body: JSON.stringify({language: languageSelect}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( (response, err) => {
            if (response.status == 200) {
                user.updateUserData().then( () =>
                    joinRoom(currentRoom)
                );
                // request user preferences and reload messages

                // joinRoom({name: "Global", email: "global", room: "global"})
            }
            else {
                throw err;
            }
        }
        ).catch( (err) => {
            throw err;
        })

      }
}