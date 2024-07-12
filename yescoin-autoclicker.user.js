// ==UserScript==
// @name         YesCoin Autoclicker
// @version      1.0
// @description  Automatic coin collector for YesCoin with play/stop functionality and auto-restart
// @match        *://*.yescoin.gold/*
// @grant        none
// @icon         https://raw.githubusercontent.com/oliver134/Yescoin/main/yescoin.png
// @downloadURL  https://github.com/oliver134/Blum/raw/main/blum-autoclicker.user.js
// @updateURL    https://github.com/oliver134/Blum/raw/main/blum-autoclicker.user.js
// @author       Emin M @emin.mir
// @homepage     https://t.me/crypto_world_aze
// ==/UserScript==

const translations = {
    EN: {
        start: 'Start',
        stop: 'Stop',
        close: 'Close',
        selectLanguage: '🌐 EN',
        faq: '    1. The main "Start/Stop" button for launching the autoclicker is located at the bottom right.<br>2. The language selection button is located at the top right.<br><br>You can find additional information on our Telegram channel or ask a question in our group <a style="color: red" href="https://t.me/crypto_world_aze">HERE</a>.<br>',
        moreinfo: 'More info here:'
    },
    RU: {
      start: 'Начать',
      stop: 'Остановить',
      close: 'Закрыть',
      selectLanguage: '🌐 РУ',
      faq: '    1. Внизу справа находится главная кнопка "Старт/Стоп" для запуска автокликера.<br>2. Наверху справа находится кнопка выбора языка.<br><br>Дополнительную информацию вы можете узнать в нашем Telegram-канале или задать вопрос в нашей группе <a style="color: red" href="https://t.me/crypto_world_aze">ТУТ</a>.<br>',
      moreinfo: 'Больше инфы тут:'
    },
     AZ: {
        start: 'Başla',
        stop: 'Dayandır',
        close: 'Bağla',
        selectLanguage: '🌐 AZ',
        faq: '    1. Avtomatik klikləyicini işə salmaq üçün əsas "Başla/Dayandır" düyməsi sağ alt küncdə yerləşir.<br>2. Dil seçimi düyməsi sağ yuxarıda yerləşir.<br><br>Əlavə məlumatı bizim Telegram kanalımızda tapa bilərsiniz və ya qrupumuzda sual verə bilərsiniz <a style="color: red" href="https://t.me/crypto_world_aze">BURADA</a>.<br>',
        moreinfo: 'Daha çox məlumat burada:'

    },
      TR: {
        start: 'Başlat',
        stop: 'Durdur',
        close: 'Kapat',
        selectLanguage: '🌐 TR',
        faq: '    1. Otomatik tıklayıcıyı başlatmak için ana "Başlat/Durdur" düğmesi sağ altta bulunur.<br>2. Dil seçimi düğmesi sağ üstte bulunur.<br><br>Ek bilgi için Telegram kanalımızdan veya grubumuzda soru sorabilirsiniz <a style="color: red" href="https://t.me/crypto_world_aze">BURADA</a>.<br>',
        moreinfo: 'Daha fazla bilgi burada:'
     },
      AR: {
        start: 'ابدأ',
        stop: 'أوقف',
        close: 'أغلق',
        selectLanguage: '🌐 AR',
        faq: '    1. يوجد زر "ابدأ/أوقف" الرئيسي لتشغيل النقر التلقائي في الأسفل على اليمين.<br>2. يوجد زر اختيار اللغة في الأعلى على اليمين.<br><br>يمكنك العثور على معلومات إضافية على قناتنا على Telegram أو طرح سؤال في مجموعتنا <a style="color: red" href="https://t.me/crypto_world_aze">هنا</a>.<br>',
        moreinfo: 'مزيد من المعلومات هنا:'
}

};

// Получение выбранного языка из localStorage или установка по умолчанию
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'EN';











// Стили для логов в консоли
const styles = {
    success: 'background: #28a745; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};

// Префикс для логов в консоли
const logPrefix = '%c[YesCoinBot] ';

// Оригинальная функция console.log
const originalLog = console.log;
console.log = function () {
    // Если первый аргумент - строка и содержит '[YesCoinBot]'
    if (typeof arguments[0] === 'string' && arguments[0].includes('[YesCoinBot]')) {
        // Вызов оригинальной функции console.log с переданными аргументами
        originalLog.apply(console, arguments);
    }
};

// Функция для ожидания появления элемента
const waitForElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const intervalTime = 100; // Интервал времени между проверками
        let timeElapsed = 0; // Время, прошедшее с начала ожидания
        const interval = setInterval(() => {
            const element = document.querySelector(selector); // Поиск элемента по селектору
            if (element) {
                clearInterval(interval); // Очистка интервала
                resolve(element); // Разрешение промиса с найденным элементом
            } else if (timeElapsed >= timeout) {
                clearInterval(interval); // Очистка интервала при превышении таймаута
                reject(new Error('Element not found')); // Отклонение промиса с ошибкой
            }
            timeElapsed += intervalTime; // Увеличение времени ожидания
        }, intervalTime);
    });
};

// Функция инициализации скрипта
const initializeScript = async () => {
    try {
        const container = await waitForElement('#coin-swipe-wrapper'); // Ожидание контейнера
        console.log(`${logPrefix}Container found`, styles.success); // Лог о нахождении контейнера

        const canvas = await waitForElement('#coin-swipe-wrapper canvas.sketch'); // Ожидание элемента canvas
        console.log(`${logPrefix}Canvas found`, styles.success); // Лог о нахождении canvas

        // Функция для создания события мыши
        const createMouseEvent = (type, x, y) => new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y
        });

        const rect = canvas.getBoundingClientRect(); // Получение размеров canvas
        const width = rect.width; // Ширина canvas
        const height = rect.height; // Высота canvas

        // Функция для получения случайных координат внутри canvas
        const getRandomCoordinates = () => ({
            x: Math.random() * width + rect.left,
            y: Math.random() * height + rect.top
        });

        // Функция для получения значения энергии
        const getEnergyValue = () => {
            const energyElement = document.querySelector('.progress-value');
            return energyElement ? parseInt(energyElement.textContent, 10) : 0;
        };

        let isRunning = true; // Флаг для управления выполнением скрипта

        // Функция для переключения состояния скрипта
        const toggleScript = () => {
            isRunning = !isRunning;
            if (isRunning) {
                console.log(`${logPrefix}Resuming script`, styles.info); // Лог о возобновлении скрипта
                moveMouse(); // Вызов функции для перемещения мыши
                playButton.textContent = translations[selectedLanguage].stop; // Изменение текста кнопки
            } else {
                console.log(`${logPrefix}Pausing script`, styles.info); // Лог о паузе скрипта
                playButton.textContent = translations[selectedLanguage].start; // Изменение текста кнопки
            }
        };

        const playButton = document.createElement('button'); // Создание кнопки Play/Stop
        playButton.textContent = translations[selectedLanguage].stop;
        playButton.style.position = 'fixed';
        playButton.style.bottom = '20px';
        playButton.style.right = '20px';
        playButton.style.zIndex = '9999';
        playButton.style.padding = '9px 11px';
        playButton.style.backgroundColor = '#8B0000';
        playButton.style.color = 'white';
        playButton.style.border = 'none';
        playButton.style.borderRadius = '10px';
        playButton.style.cursor = 'pointer';

        playButton.addEventListener('click', toggleScript); // Добавление обработчика клика на кнопку
        document.body.appendChild(playButton); // Добавление кнопки в документ

        // Функция для перемещения мыши
        const moveMouse = () => {
            if (!isRunning) return; // Выход из функции, если скрипт не выполняется

            if (getEnergyValue() === 0) {
                const waitTime = Math.random() * 240000 + 60000; // Ожидание от 1 до 5 минут
                console.log(`${logPrefix}Energy is 0, waiting for ${waitTime / 1000} seconds`, styles.info); // Лог об ожидании
                setTimeout(initializeScript, waitTime); // Перезапуск скрипта через определенное время
                return;
            }

            const numMoves = 10; // Количество движений мыши
            for (let i = 0; i < numMoves; i++) {
                const { x, y } = getRandomCoordinates(); // Получение случайных координат
                canvas.dispatchEvent(createMouseEvent('mousemove', x, y)); // Создание и отправка события мыши
            }

            requestAnimationFrame(moveMouse); // Рекурсивный вызов функции с использованием requestAnimationFrame
        };

        moveMouse(); // Начало выполнения скрипта

    } catch (error) {
        console.log(`${logPrefix}Error in YesCoin Collector script: ${error.message}`, styles.error); // Лог об ошибке
    }
};











// Функция для создания кнопок выбора языка
const createLanguageButton = (language) => {
    const button = document.createElement('button');
    button.textContent = language;
    button.style.backgroundColor = selectedLanguage === language ? 'rgba(255, 255, 255, 0.8)' : 'white';
    button.style.color = 'snow';
    button.style.backgroundColor = '#007BFF';
  button.style.fontWeight = 'bold';
button.style.fontSize = '14px';
button.style.alignItems = 'center';
button.style.textDecoration = 'none';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '5px 10px';
      button.style.margin = '5px 10px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
        selectedLanguage = language;
        localStorage.setItem('selectedLanguage', selectedLanguage);
        location.reload();
    });
    return button;
};

// Создание кнопки для открытия модального окна
const languageButton = document.createElement('button');
languageButton.textContent = translations[selectedLanguage].selectLanguage;
languageButton.style.position = 'fixed';
languageButton.style.top = '20px';
languageButton.style.right = '20px';
languageButton.style.zIndex = '9999';
languageButton.style.padding = '9px 11px';
languageButton.style.backgroundColor = '#007BFF';
languageButton.style.color = 'white';
languageButton.style.border = 'none';
languageButton.style.borderRadius = '10px';
languageButton.style.cursor = 'pointer';

document.body.appendChild(languageButton);

// Создание модального окна для выбора языка
const modal = document.createElement('div');
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.zIndex = '10000';
modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
modal.style.padding = '3% 2%';
modal.style.borderRadius = '10px';
modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
modal.style.fontFamily = 'Arial, sans-serif';
modal.style.border = '1px solid black';






const languageContainer = document.createElement('div');
const languages = ['EN', 'RU', 'AZ', 'TR', 'AR'];
languages.forEach(language => {
    const languageButton = createLanguageButton(language);
    languageContainer.appendChild(languageButton);
});

modal.appendChild(languageContainer);
document.body.appendChild(modal);

// Обработчик клика для кнопки открытия модального окна
languageButton.addEventListener('click', () => {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
});

















    // Создаем уникальный идентификатор для модального окна и кнопки
    var modalId = 'uniqueModalId';
    var buttonId = 'uniqueButtonId';

    // Создаем кнопку
    var button = document.createElement('button');
    button.innerText = '?';
    button.id = buttonId;
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.zIndex = '9999';
button.style.padding = '9px 11px';
button.style.backgroundColor = '#007BFF';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '10px';
button.style.cursor = 'pointer';
button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
button.style.fontFamily = 'Arial, sans-serif';
  button.style.fontWeight = 'bold';
button.style.fontSize = '14px';
button.style.alignItems = 'center';
button.style.textDecoration = 'none';
    document.body.appendChild(button);

    // Функция для создания модального окна
    function createModal() {
        var existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.style.display = 'block';
            return;
        }

        var modal = document.createElement('div');
        modal.id = modalId;
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1000';
       modal.style.top = '50%';
       modal.style.left = '50%';
        modal.style.overflow = 'auto';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//modal.style.padding = '2% 1%';
modal.style.borderRadius = '10px';
modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
modal.style.fontFamily = 'Arial, sans-serif';
modal.style.border = '1px solid black';








        var modalContent = document.createElement('div');
        modalContent.style.color = 'snow';
       //modalContent.style.margin = '7% auto';
       modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
       // modalContent.style.width = '15%';
  modalContent.style.fontWeight = 'bold';
modalContent.style.fontSize = '14px';
modalContent.style.alignItems = 'center';
modalContent.style.textDecoration = 'none';



        var modalText = document.createElement('p');

       // modalText.innerText = '1111111111111111jjjljlkjlkjkljlkjljljljljljljlyyutyutghjgjhghghgjhgjhgjgjggjhggjgg1111111111111111jjjljlkjlkjkljlkjljljljljljljlyyutyutghjgjhghghgjhgjhgjgjggjhggjgg1111111111111111jjjljlkjlkjkljlkjljljljljljljlyyutyutghjgjhghghgjhgjhgjgjggjhggjgg1111111111111111jjjljlkjlkjkljlkjljljljljljljlyyutyutghjgjhghghgjhgjhgjgjggjhggjgg1111111111111111jjjljlkjlkjkljlkjljljljljljljlyyutyutghjgjhghghgjhgjhgjgjggjhggjgg';
modalText.innerHTML = translations[selectedLanguage].faq;


      var closeButton = document.createElement('button');
        closeButton.innerText = translations[selectedLanguage].close;
        closeButton.style.marginTop = '10px';
closeButton.style.padding = '9px 11px';
closeButton.style.backgroundColor = '#007BFF';
closeButton.style.color = 'white';
closeButton.style.border = 'none';
closeButton.style.borderRadius = '10px';
closeButton.style.cursor = 'pointer';
closeButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
closeButton.style.fontFamily = 'Arial, sans-serif';
  closeButton.style.fontWeight = 'bold';
closeButton.style.fontSize = '14px';
closeButton.style.alignItems = 'center';
closeButton.style.textDecoration = 'none';


        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        modalContent.appendChild(modalText);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Добавляем обработчик клика на кнопку
    button.addEventListener('click', function() {
        createModal();
        var modal = document.getElementById(modalId);
        modal.style.display = 'block';
    });





























// Контейнер для управляющих элементов
const controlsContainer = document.createElement('div');
controlsContainer.style.position = 'fixed';
controlsContainer.style.top = '0';
controlsContainer.style.left = '50%';
controlsContainer.style.transform = 'translateX(-50%)';
controlsContainer.style.zIndex = '9999';
controlsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
controlsContainer.style.padding = '3px 12px';
controlsContainer.style.borderRadius = '10px';
controlsContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
controlsContainer.style.fontFamily = 'Arial, sans-serif';
controlsContainer.style.border = '1px solid black';
document.body.appendChild(controlsContainer);

// Контейнер для информации о скрипте
const infoContainer = document.createElement('div');
infoContainer.style.display = 'inline-block';
infoContainer.style.marginRight = '10px';

// Текст информации
const infoText = document.createElement('a');
infoText.href = atob('aHR0cHM6Ly90Lm1lL2NyeXB0b193b3JsZF9hemU=');
infoText.innerHTML = translations[selectedLanguage].moreinfo;
infoText.style.color = 'white';
infoText.style.fontWeight = 'bold';
infoText.style.fontSize = '9px';
infoText.style.marginBottom = '5px';
infoText.style.alignItems = 'center';
infoText.style.textDecoration = 'none';

// Изображение Telegram
const telegramImage = document.createElement('img');
telegramImage.src = 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/telegram/telegram.png';
telegramImage.style.width = '15px';
telegramImage.style.height = '15px';
telegramImage.style.marginRight = '5px';
telegramImage.addEventListener('click', function() {
    window.location.href = atob('aHR0cHM6Ly90Lm1lL2NyeXB0b193b3JsZF9hemU=');
});

// Ссылка на Telegram
const telegramLink = document.createElement('a');
telegramLink.href = atob('aHR0cHM6Ly90Lm1lL2NyeXB0b193b3JsZF9hemU=');
telegramLink.innerHTML = atob('Q3J5cHRvIFdvcmxkCg==');
telegramLink.style.color = 'white';
telegramLink.style.fontWeight = 'bold';
telegramLink.style.fontSize = '14px';
telegramLink.style.textDecoration = 'none';

// Контейнер для Telegram
const telegramContainer = document.createElement('div');
telegramContainer.style.display = 'flex';
telegramContainer.style.alignItems = 'center';
telegramContainer.appendChild(telegramImage);
telegramContainer.appendChild(telegramLink);
infoContainer.appendChild(infoText);
infoContainer.appendChild(telegramContainer);
controlsContainer.appendChild(infoContainer);

// Запуск скрипта через 3 секунды после загрузки страницы
setTimeout(initializeScript, 3000);
