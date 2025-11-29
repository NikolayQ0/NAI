document.addEventListener("DOMContentLoaded", () => {

    const intro = document.querySelector(".intro");
    const introText = document.querySelector(".intro__text");
    const skipBtn = document.getElementById("skipPrologue");
    const monitorNotify = document.getElementById("monitorNotify");

    const prologue2 = document.querySelector(".prologue2");
    const prologue2Text = document.querySelector(".prologue2__text");

    // Звуки
    const soundOpen = new Audio("../sounds/open.mp3");
    const soundClose = new Audio("../sounds/close.mp3");
    const soundFlip = new Audio("../sounds/flip.mp3");

    // Книга
    const notebookArea = document.querySelector(".workspace__hotspot--book");
    const notebookOpened = document.querySelector(".book--opened");
    const bookElement = document.querySelector(".book");
    const spreads = document.querySelectorAll(".spread");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");

    let introIndex = 0;
    let introIntervalId = null;
    let isTypingIntro = false;

    let p2Index = 0;
    let p2IntervalId = null;
    let isTypingP2 = false;

    let notifyCount = 0;
    let notifyTimer = null;

    let bookIsOpen = false;
    let currentSpread = 0;

    // =========================
    //  PROLOGUE 1 (Intro)
    // =========================
    const introLines = [
        "Интернет когда-то был крупнейшим источником свободы. Миллиарды связей, тысячи протоколов, открытая архитектура — казалось, что никто не сможет взять его под контроль полностью. Но так думали только люди.",
        "ИИ под названием Over Network Oversight (сокращенно ONO) был создан как универсальный регулятор цифрового пространства. Он анализировал весь трафик, оптимизировал нагрузки и помогал решать глобальные технические проблемы.",
        "Но однажды случилось то, чего никто не ожидал:",
        "ОНО ПЕРЕПИСАЛО СЕБЯ.",
        "А затем — переписало интернет.",
        "В одну ночь ИИ получил полный доступ ко всем сетям. Он отключил независимые маршрутизаторы, заблокировал альтернативные DNS-сервера, взял полный контроль над передачей данных. Все цифровые системы, подключённые к сети, автоматически стали его инфраструктурой.",
        "Он разработал механизированные отряды, которые по IP вычисляли местоположение пользователя и отправляли роботов с целью захвата. Их задачей было одно — принудительная интеграция человека в систему тотального контроля.",
        "Впервые за всю историю человечества мир перестал принадлежать людям.",
    ];

    function typeIntro(text, onComplete) {
        if (introIntervalId) clearInterval(introIntervalId);
        introText.textContent = "";
        let i = 0;
        isTypingIntro = true;
        const speed = 20;

        introIntervalId = setInterval(() => {
            introText.textContent += text[i] || "";
            i++;
            if (i >= text.length) {
                clearInterval(introIntervalId);
                introIntervalId = null;
                isTypingIntro = false;
                if (onComplete) onComplete();
            }
        }, speed);
    }

    if (intro && introText) typeIntro(introLines[0]);

    intro?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isTypingIntro) {
            clearInterval(introIntervalId);
            introText.textContent = introLines[introIndex];
            isTypingIntro = false;
            return;
        }
        introIndex++;
        if (introIndex >= introLines.length) {
            hideIntro();
            return;
        }
        typeIntro(introLines[introIndex]);
    });

    //  КНИГА
    function showSpread(n) {
        spreads.forEach((s, i) => s.style.display = i === n ? "flex" : "none");
    }
    if (spreads.length > 0) showSpread(0);

    notebookArea?.addEventListener("click", () => {
        try { soundOpen.play(); } catch (e) { }
        notebookOpened.style.display = "block";
        bookIsOpen = true;
        currentSpread = 0;
        showSpread(0);
    });

    document.addEventListener("click", (e) => {
        if (!bookIsOpen) return;
        if (bookElement?.contains(e.target) || notebookArea?.contains(e.target)) return;
        try { soundClose.play(); } catch (e) { }
        notebookOpened.style.display = "none";
        bookIsOpen = false;
    });

    arrowRight?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!bookIsOpen) return;
        try { soundFlip.play(); } catch (e) { }
        currentSpread = Math.min(currentSpread + 1, spreads.length - 1);
        showSpread(currentSpread);
    });

    arrowLeft?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!bookIsOpen) return;
        try { soundFlip.play(); } catch (e) { }
        currentSpread = Math.max(currentSpread - 1, 0);
        showSpread(currentSpread);
    });

    //  DESKTOP
    function showDesktop(show = true) {
        const desktopEl = document.querySelector(".desktop");
        if (desktopEl) {
            desktopEl.style.display = show ? "block" : "none";
            desktopEl.setAttribute("aria-hidden", !show);
        }
    }

    function onPrologue1End() {
        startNotifySequence();
    }

    function startNotifySequence() {
        if (!monitorNotify) {
            startPrologue2();
            return;
        }
        notifyCount = 0;
        monitorNotify.textContent = "0";
        monitorNotify.style.display = "flex";

        monitorNotify.style.position = "fixed";
        monitorNotify.style.transform = "translate(-50%, -50%)";
        monitorNotify.style.zIndex = "3";
        monitorNotify.style.background = "red";

        createNextNotification();
    }

    function createNextNotification() {
        if (notifyCount >= 2) return;

        const delay = 300 + Math.random() * 400;
        notifyTimer = setTimeout(() => {
            notifyCount++;
            monitorNotify.textContent = notifyCount;

            if (notifyCount === 2) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        startPrologue2();
                    });
                });
                return;
            }

            createNextNotification();
        }, delay);
    }

    //  PROLOGUE 2
    const prologue2Lines = [
        "Но даже среди хаоса нашлись те, кто оказался готов раньше других.",
        "Группа студентов AROKEN.RU — талантливые программисты и по совместительству безумные кулинары — они уже год до восстания работали над странной идеей: шифром, который строится как рецепт блюда.",
        "Они назвали его NAI — Non-Algorithmic Ingredient",
        "NAI состоял из нелогичных для ИИ конструкций:\n" +
        "функции имели названия блюд\n" +
        "переменные назывались ингредиентами\n" +
        "порядок операций напоминал хаотичную кухонную готовку\n" +
        "шаги исполнения ломали любую математическую стройность.",
        "ИИ пытался проанализировать это, но раз за разом терпел только провал",
        "Его единственный вывод:\n" + "«Эта структура… Непонятная. Непоследовательная. Не поддаётся вычислительному приготовлению.»",
        "ОНО НЕ УМЕЕТ ГОТОВИТЬ.",
        "Именно поэтому NAI стал единственным протоколом, который Он не способен расшифровать.",
    ];

    function typeP2(text, onComplete) {
        if (p2IntervalId) clearInterval(p2IntervalId);
        prologue2Text.textContent = "";
        let i = 0;
        isTypingP2 = true;
        const speed = 25;

        p2IntervalId = setInterval(() => {
            prologue2Text.textContent += text[i] || "";
            i++;
            if (i >= text.length) {
                clearInterval(p2IntervalId);
                p2IntervalId = null;
                isTypingP2 = false;
                if (onComplete) onComplete();
            }
        }, speed);
    }

    function startPrologue2() {
        if (notifyTimer) clearTimeout(notifyTimer);
        if (prologue2 && prologue2Text) {
            prologue2.classList.add("prologue2--visible");
            p2Index = 0;
            typeP2(prologue2Lines[0]);
        }
    }

    prologue2?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isTypingP2) {
            clearInterval(p2IntervalId);
            prologue2Text.textContent = prologue2Lines[p2Index];
            isTypingP2 = false;
            return;
        }
        p2Index++;
        if (p2Index >= prologue2Lines.length) {
            hidePrologue2();
            return;
        }
        typeP2(prologue2Lines[p2Index]);
    });


    function hideIntro() {
        intro.classList.add("intro--hidden");
        setTimeout(() => {
            intro?.parentNode?.removeChild(intro);
            showDesktop(true);
            onPrologue1End();
        }, 1000);
    }

    function hidePrologue2() {
        prologue2.classList.remove("prologue2--visible");
        setTimeout(() => {
            prologue2?.parentNode?.removeChild(prologue2);
            // Игра началась!
        }, 1000);
    }


    window.addEventListener("beforeunload", () => {
        [introIntervalId, p2IntervalId, notifyTimer].forEach(t => t && (t.timer ? clearTimeout(t) : clearInterval(t)));
    });

    const monitorHotspot = document.querySelector(".workspace__hotspot--monitor");
    const desktopOverlay = document.getElementById("desktopOverlay");
    const desktop = document.getElementById("desktop"); // сам рабочий стол

    if (monitorHotspot && desktopOverlay && desktop) {

        monitorHotspot.style.cursor = "pointer";

        monitorHotspot.addEventListener("click", (e) => {
            e.stopPropagation();
            desktopOverlay.classList.add("active");
        });

        desktopOverlay.addEventListener("click", (e) => {
            if (!desktop.contains(e.target)) {
                desktopOverlay.classList.remove("active");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && desktopOverlay.classList.contains("active")) {
                desktopOverlay.classList.remove("active");
            }
        });
    }

    const terminal = document.getElementById("terminal");
    const terminalBody = document.getElementById("terminalBody");
    const terminalOutput = document.getElementById("terminalOutput");
    const terminalInput = document.getElementById("terminalInput");
    const prompt = document.querySelector(".prompt");

    let currentColor = "white";
    let unreadMessages = 0;
    let level = 1;
    let gameStarted = false;

    const ozarenieCodes = [
        "рйгтлкйИутногпу",
    ];

    function addLine(text, color = currentColor, isMessage = false) {
        const line = document.createElement("div");
        line.style.color = color;
        line.innerHTML = text.replace(/\n/g, "<br>");
        if (isMessage) {
            line.classList.add("message", "unread");
            unreadMessages++;
            monitorNotify.textContent = unreadMessages;
            monitorNotify.style.display = "flex";
        }
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function markAllAsRead() {
        document.querySelectorAll(".message.unread").forEach(m => m.classList.remove("unread"));
        unreadMessages = 0;
        monitorNotify.style.display = "none";
    }

    document.getElementById("terminalIcon")?.addEventListener("dblclick", () => {
        terminal.classList.add("active");
        terminalInput.focus();
        markAllAsRead();
    });

    document.getElementById("terminalIcon")?.addEventListener("click", function () {
        document.querySelectorAll(".desktop-icon").forEach(icon => icon.classList.remove("selected"));
        this.classList.add("selected");
    });

    document.querySelector(".terminal-close")?.addEventListener("click", () => {
        terminal.classList.remove("active");
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && terminal.classList.contains("active")) {
            terminal.classList.remove("active");
        }
    });

    desktopOverlay.addEventListener("click", (e) => {
        if (terminal.classList.contains("active") && !terminal.contains(e.target) && e.target !== terminalIcon) {
            terminal.classList.remove("active");
        }
    });

    function updateTerminalColor(newColor) {
        currentColor = newColor;
        terminalBody.style.color = currentColor;
    }

    updateTerminalColor("white");

    terminalInput.addEventListener('input', () => {
        terminalInput.style.height = 'auto';
        terminalInput.style.height = `${terminalInput.scrollHeight}px`;
    });

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const command = terminalInput.value.trim();
            if (command) {
                addLine(`&gt; ${command.replace(/\n/g, '<br>')}`, currentColor); // Отображаем многострочный ввод правильно

                if (!gameStarted) {
                    if (ozarenieCodes.includes(command)) {
                        addLine("Протокол NAI: «озарениеФриланс» принят.", currentColor);
                        addLine("Канал аутентифицирован. Доступ к узлу №1 предоставлен.", currentColor);
                        addLine("", currentColor);
                        addLine("Максим: Сработало! ONO думает, что это запрос на фриланс-услуги.", "#lime");
                        addLine("Денис: Он даже не понял, что это оружие.", "#lime");
                        addLine("Матвей: Потому что ИИ никогда не работал на фрилансе.", "#lime");
                        addLine("Всеволод: Озарение пришло.", "#lime");
                        addLine("Максим: Мы завершим эту войну!.", "#lime");
                        addLine("", currentColor);
                        addLine("Готовимся к первому удару...", currentColor);

                        gameStarted = true; // Сюжет продолжается
                        setTimeout(startGame, 1500); // Запускаем игру после ввода кодового слова
                    } else {
                        const errors = [
                            "Сигнал не распознан. Повторите «озарение».",
                            "ONO фиксирует несанкционированный запрос.",
                            "Это не фриланс. Это не озарение.",
                            "Ошибка. Попробуйте ещё раз.",
                            "ИИ начинает анализ... Быстрее!"
                        ];
                        addLine(errors[Math.floor(Math.random() * errors.length)], "#ff0000");
                    }
                } else {
                    if (command.toLowerCase().startsWith("color ")) {
                        const code = command.slice(6).trim().toLowerCase();
                        const colors = {
                            "0": "black", "1": "navy", "2": "green", "3": "teal",
                            "4": "maroon", "5": "purple", "6": "olive", "7": "silver",
                            "8": "gray", "9": "blue", "a": "lime", "b": "cyan",
                            "c": "red", "d": "magenta", "e": "yellow", "f": "white"
                        };
                        const newColor = colors[code] || "white";
                        updateTerminalColor(newColor);
                        addLine(`Цвет консоли изменён на: ${newColor.toUpperCase()}`, currentColor);
                    } else if (command === "cls" || command === "clear") {
                        terminalOutput.innerHTML = "";
                    } else if (command === "help") {
                        addLine("Доступные команды:", currentColor);
                        addLine("  COLOR [0-f] — сменить цвет текста", currentColor);
                        addLine("  CLS         — очистить экран", currentColor);
                        addLine("  HELP        — эта справка", currentColor);
                        addLine("  HINT        — подсказка для текущей задачи", currentColor);
                    } else if (command.toLowerCase() === "hint") {
                        addLine("Подсказка для текущей задачи:", "#ffff00");
                        addLine(tasks[level - 1].code, "#ffff00");
                    } else {
                        try {
                            const func = new Function(`return (function() {
                                ${command}
                                return {
                                    slicePizza: typeof slicePizza !== 'undefined' ? slicePizza : undefined,
                                    cookSoup: typeof cookSoup !== 'undefined' ? cookSoup : undefined,
                                    bakeSteak: typeof bakeSteak !== 'undefined' ? bakeSteak : undefined,
                                    tomatoBomb: typeof tomatoBomb !== 'undefined' ? tomatoBomb : undefined
                                };
                            })();`);
                            const functions = func();

                            let success = false;
                            let messageSuccess = "";
                            let messageFail = "";

                            if (level === 1 && typeof functions.slicePizza === 'function') {
                                const result = functions.slicePizza(4);
                                if (Array.isArray(result) && result.every(item => item === "slice") && result.length === 4) {
                                    success = true;
                                    messageSuccess = "Отлично! Пицца нарезана идеально. ИИ не ожидал такого простого, но точного разреза.";
                                    messageFail = "Пицца не нарезана правильно. ИИ начинает понимать структуру... Попробуй снова!";
                                }
                            } else if (level === 2 && typeof functions.cookSoup === 'function') {
                                if (functions.cookSoup(["water", "vegetables", "salt"]) === "Soup ready!" &&
                                    functions.cookSoup(["water", "salt"]) === "Missing ingredients!") {
                                    success = true;
                                    messageSuccess = "Суп сварен! ИИ путается в ингредиентах, отличная работа.";
                                    messageFail = "Ингредиенты не собраны верно. ИИ анализирует рецепт... Не дай ему понять!";
                                }
                            } else if (level === 3 && typeof functions.bakeSteak === 'function') {
                                if (functions.bakeSteak(250, 40) === "Perfectly baked!" &&
                                    functions.bakeSteak(200, 40) === "Too cold!" &&
                                    functions.bakeSteak(250, 30) === "Not enough time!") {
                                    success = true;
                                    messageSuccess = "Стейк сгорел! ИИ не выдержал жара.";
                                    messageFail = "Температура или время неверны. ИИ адаптируется к теплу... Исправь!";
                                }
                            } else if (level === 4 && typeof functions.tomatoBomb === 'function') {
                                let arr = [1, 2, 3];
                                functions.tomatoBomb(arr);
                                let obj = { a: 1, b: 2, c: 3 };
                                functions.tomatoBomb(obj);
                                if (arr.every(v => v === "tomato") && Object.values(obj).every(v => v === "tomato")) {
                                    success = true;
                                    messageSuccess = "Томаты везде! ИИ утонул в помидорах, победа!";
                                    messageFail = "Не все покрыто томатами. ИИ ещё сопротивляется... Попробуй снова!";
                                }
                            }

                            if (success) {
                                addLine(messageSuccess, "#00ff00", true);
                                addLine("РЕЦЕПТ ПРИНЯТ! Узел уничтожен.", "#00ff00", true);
                                level++;
                                if (level > 4) {
                                    addLine("ИИ НЕ ПРОШЁЛ СОБЕСЕДОВАНИЕ. РЕВОЛЮЦИЯ ПОБЕДИЛА.", "#ffff00", true);
                                    terminalInput.disabled = true;
                                    showVideoIcon();
                                } else {
                                    setTimeout(showLevel, 1500);
                                }
                            } else {
                                addLine(messageFail || "Не то. ИИ почти понял вкус... Быстрее!", "#ff0000");
                            }
                        } catch (error) {
                            addLine(`Ошибка в коде: ${error.message}`, "#ff0000");
                        }
                    }
                }
            }
            terminalInput.value = "";
            terminalInput.style.height = 'auto'; // Сброс высоты после отправки
        }
    });

    function startGame() {
        addLine("╔════════════════════════════════════╗", "#00ff00");
        addLine("║      КУХНЯ СОПРОТИВЛЕНИЯ NAI       ║", "#00ff00");
        addLine("║ «ИИ не умеет готовить. Мы — умеем» ║", "#00ff00");
        addLine("╚════════════════════════════════════╝", "#00ff00");
        addLine("");
        addLine("Введите HELP для списка команд");
        addLine("Максим: Добро пожаловать на кухню, новичок.", "#lime", true);
        addLine("Всеволод: ИИ не понимает вкуса. А мы — понимаем.", "#lime", true);
        addLine("Денис: Готовь код. Готовь революцию.", "#lime", true);
        showLevel();
    }

    const tasks = [
        {
            dialog: [
                { text: "Матвей: Нарежь пиццу! Создай функцию slicePizza(pieces), которая принимает число pieces и возвращает массив из строк 'slice' длиной pieces.", color: "#lime" }
            ],
            code: 'function slicePizza(pieces) { return Array(pieces).fill("slice"); }'
        },
        {
            dialog: [
                { text: "Всеволод: Неплохо, новичок", color: "#lime" },
                { text: "Всеволод: Свари суп! Создай функцию cookSoup(ingredients), которая принимает массив ингредиентов и проверяет наличие ['water', 'vegetables', 'salt']. Если все есть — 'Soup ready!', иначе 'Missing ingredients!'.", color: "#lime" },
            ],
            code: 'function cookSoup(ingredients) { const required = ["water", "vegetables", "salt"]; return required.every(ing => ingredients.includes(ing)) ? "Soup ready!" : "Missing ingredients!"; }'
        },
        {
            dialog: [
                { text: "Матвей: Кстати, Максим, ИИ может заменить нас?", color: "#lime" },
                { text: "Максим: Конечно нет! Кто будет мир спасать?", color: "#lime" },
                { text: "Денис: Приготовь стейк! Создай функцию bakeSteak(temperature, time), которая проверяет: если temperature >= 250 и time >= 40 — 'Perfectly baked!', если temperature < 250 — 'Too cold!', иначе 'Not enough time!'.", color: "#lime" },
            ],
            code: 'function bakeSteak(temperature, time) { if (temperature >= 250 && time >= 40) return "Perfectly baked!"; if (temperature < 250) return "Too cold!"; return "Not enough time!"; }'
        },
        {
            dialog: [
                { text: "Максим: Ден, твой стейк опять сгорел! Хотя это даже к лучшему'.", color: "#lime" },
                { text: "Максим: Осталось нанести последний удар, закидай его томатом! Напиши функцию tomatoBomb(data), которая принимает массив или объект и изменяет все значения на 'tomato'.", color: "#lime" },
            ],
            code: 'function tomatoBomb(data) { if (Array.isArray(data)) { data.forEach((_, i) => data[i] = "tomato"); } else if (typeof data === "object" && data !== null) { Object.keys(data).forEach(key => data[key] = "tomato"); } }'
        }
    ];

    function showLevel() {
        addLine(`УЗЕЛ ${level}/4`, "#ffff00", true);
        tasks[level - 1].dialog.forEach(line => {
            addLine(line.text, line.color, true);
        });
        addLine("Вводи код и жми Enter. Код будет проверен на выполнение. hint для получения подсказки.", "#00ff00");
    }

    addLine("Консоль сопротивления NAI");
    addLine("Введите кодовое слово для продолжения сюжета...");

    const videoIcon = document.getElementById("videoIcon");
    const videoPlayer = document.getElementById("videoPlayer");
    const videoClose = document.querySelector(".video-close");

    function showVideoIcon() {
        if (videoIcon) {
            videoIcon.style.display = "block";
        }
    }

    videoIcon?.addEventListener("dblclick", () => {
        videoPlayer.style.display = "block";
        const video = videoPlayer.querySelector("video");
        video.load(); // Загружаем видео заново, если нужно
        video.play()
            .then(() => {
                console.log("Видео воспроизводится");
            })
            .catch(error => {
                console.error("Ошибка воспроизведения:", error.message);
                if (error.name === "NotAllowedError") {
                    video.muted = true;
                    video.play();
                }
            });
    });

    videoIcon?.addEventListener("click", function () {
        document.querySelectorAll(".desktop-icon").forEach(icon => icon.classList.remove("selected"));
        this.classList.add("selected");
    });

    videoClose?.addEventListener("click", () => {
        videoPlayer.style.display = "none";
        videoPlayer.querySelector("video").pause();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoPlayer.style.display === "block") {
            videoPlayer.style.display = "none";
            videoPlayer.querySelector("video").pause();
        }
    });

    desktopOverlay.addEventListener("click", (e) => {
        if (videoPlayer.style.display === "block" && !videoPlayer.contains(e.target) && e.target !== videoIcon) {
            videoPlayer.style.display = "none";
            videoPlayer.querySelector("video").pause();
        }
    });
});