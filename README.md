## Фильмы Seasonvar и ColdFilm
### (не актуально :-( )

* **local** - страница расширения - [serial.koljasha.ru](https://serial.koljasha.ru/)
* **backend** - backend для обработки Extension (seasonvar не работает вне России)
* **extension** - расширение для Opera, Firefox, Chrome
* **seasonvar** - прямые ссылки страницы (нужен локальный *chromedriver*)

* Сборка:
```
git clone https://github.com/Koljasha/seasonvar/
cd seasonvar/local/
npm i
npm run build
```

* ветка **deploy** для развертывания на сервере
```
git clone --branch deploy https://github.com/Koljasha/seasonvar.git
```
