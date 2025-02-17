/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _views_TaskUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./views/TaskUI */ \"./src/views/TaskUI.ts\");\n\n//Para garantir que o código dos scripts só é executado depois de carregar a página (HTML & CSS)\nwindow.addEventListener(\"load\", () => {\n    const taskUI = new _views_TaskUI__WEBPACK_IMPORTED_MODULE_0__.TaskUI();\n    console.log(taskUI);\n    //Bastava fazer new TaskUI() pois o construtor da classe trata de tudo e nao vou precisar de chamar métodos aqui, usando, por exemplo, taskUI.método1\n});\n\n\n//# sourceURL=webpack://typescript-project/./src/main.ts?");

/***/ }),

/***/ "./src/services/TaskManager.ts":
/*!*************************************!*\
  !*** ./src/services/TaskManager.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TaskManager: () => (/* binding */ TaskManager)\n/* harmony export */ });\nclass TaskManager {\n    taskList; //Declarar a lista\n    constructor() {\n        this.taskList = this.loadTasks(); //Inicializar/Criar Lista de tarefas (importar uma ja guardada na localStorage ou criar uma nova/vazia)\n    }\n    loadTasks() {\n        const storedList = localStorage.getItem(\"taskList\"); //Ler a lista guardada na LocalStorage, pode existir ou nao\n        if (storedList) {\n            return JSON.parse(storedList);\n        }\n        else {\n            return []; //Criar uma lista de tarefas vazia para o caso de nao existir nenhuma guardada\n        }\n    }\n    saveTasks() {\n        localStorage.setItem(\"taskList\", JSON.stringify(this.taskList));\n    }\n    //Métodos publicos podem ser acedidos fora da classe (os privados apenas podem ser acedidos dentro da classe, com o this.)\n    getTaskList() {\n        return this.taskList;\n    }\n    changeTaskState(id) {\n        const taskToChange = this.taskList.find(task => task.id === id);\n        if (taskToChange) {\n            taskToChange.complete = !taskToChange.complete;\n            this.saveTasks();\n        }\n    }\n    addTask(taskInputText) {\n        const task = {\n            id: `${taskInputText.toLowerCase().split(\" \").join(\"-\")}-${Date.now()}`,\n            task: taskInputText,\n            complete: false\n        };\n        this.taskList.push(task);\n        this.saveTasks();\n    }\n    removeTask(taskID) {\n        this.taskList = this.taskList.filter((task) => task.id !== taskID); //Vai guardar apenas as tasks que tiverem um ID diferente da que queremos apagar\n        this.saveTasks();\n    }\n    clearTaskList() {\n        this.taskList = [];\n        this.saveTasks();\n        //localStorage.removeItem(\"taskList\");\n    }\n    clearCompletedTasks() {\n        this.taskList = this.taskList.filter((task) => {\n            return task.complete !== true;\n        });\n        this.saveTasks();\n    }\n    //Muda o estado para todas completas ou muda para todas incompletas\n    checkAllTasks(checkState) {\n        //Verificar se a checkbox esta selecionada ou nao (true ou false, passado como argumento no TaskUI)\n        if (checkState) {\n            this.taskList.forEach((task) => {\n                return task.complete = true; //Coloca todas a true\n            });\n            //console.log(\"colocou todas a true\");\n        }\n        else {\n            this.taskList.forEach((task) => {\n                return task.complete = false; //Coloca todas a falso\n            });\n            //console.log(\"colocou todas a false\");\n        }\n        this.saveTasks();\n    }\n}\n\n\n//# sourceURL=webpack://typescript-project/./src/services/TaskManager.ts?");

/***/ }),

/***/ "./src/views/TaskUI.ts":
/*!*****************************!*\
  !*** ./src/views/TaskUI.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TaskUI: () => (/* binding */ TaskUI)\n/* harmony export */ });\n/* harmony import */ var _services_TaskManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/TaskManager */ \"./src/services/TaskManager.ts\");\n\nclass TaskUI {\n    taskManager;\n    taskForm;\n    inputText;\n    clearCompletedTasksBtn;\n    confirmClearTasksDialog;\n    taskList;\n    checkAllBtn;\n    constructor() {\n        this.taskManager = new _services_TaskManager__WEBPACK_IMPORTED_MODULE_0__.TaskManager();\n        this.taskForm = document.getElementById(\"taskForm\");\n        this.inputText = document.getElementById(\"taskInput\");\n        this.clearCompletedTasksBtn = document.getElementById(\"clearCompletedTasksBtn\");\n        this.confirmClearTasksDialog = document.getElementById(\"confirmClearTasksDialog\");\n        this.taskList = document.getElementById(\"list\");\n        this.checkAllBtn = document.getElementById(\"checkAllBtn\");\n        this.initialize(); //Ao chamar o new TaskUI() inicializamos a class TaskUI com todas as suas propriedades e o construtor, que por sua vez irá usar este metodo initialize() para iniciar a aplicação\n    }\n    initialize() {\n        this.taskForm.addEventListener(\"submit\", (event) => this.taskSubmit(event));\n        this.clearCompletedTasksBtn.addEventListener(\"click\", () => this.clearCompletedTasks());\n        this.checkAllBtn.addEventListener(\"change\", () => this.checkAllTasks());\n        this.renderTasks();\n    }\n    taskSubmit(event) {\n        event.preventDefault();\n        const taskText = this.inputText.value.trim();\n        //Se utilizador escreveu alguma coisa (ou seja, nao são espaços em branco)\n        if (taskText) {\n            this.taskManager.addTask(taskText);\n            this.inputText.value = \"\";\n            this.renderTasks();\n        }\n        else {\n            this.inputText.value = \"\"; //Se escreveu apenas espaços, apaga tudo para começar de novo\n        }\n    }\n    clearCompletedTasks() {\n        //Como só usamos estes botões aqui não criei como propriedades da classe (instâncias da classe)\n        //const yesBtn = document.getElementById(\"yesBtn\") as HTMLButtonElement;\n        //const noBtn = document.getElementById(\"yesBtn\") as HTMLButtonElement;\n        //Ativar o Dialog\n        this.confirmClearTasksDialog.showModal();\n        //Utilizando os botoes \"Yes\" e \"No\" como Submit, podemos usar a propriedade returnValue do Dialog para saber o que foi submetido com os botoes\n        this.confirmClearTasksDialog.addEventListener(\"close\", () => {\n            //Se o utilizador carregou no \"Yes\" (automaticada o dialog faz close() depois do submit)\n            if (this.confirmClearTasksDialog.returnValue === \"Yes\") {\n                this.taskManager.clearCompletedTasks();\n                this.checkAllBtn.checked = false; //Limpar o botao de check all\n                this.renderTasks();\n            }\n            else {\n                //Carregou no botão \"No\" portanto não queremos que aconteça nada\n            }\n        });\n        /*Outra forma era escutar por cada um dos botões independentemente e agir de acordo com cada um\n        yesBtn.addEventListener(\"click\", () => {\n          this.taskManager.clearTaskList();\n          this.renderTasks();\n          this.confirmClearTasksDialog.close();\n        });\n    \n        noBtn.addEventListener(\"click\", () => {\n          this.confirmClearTasksDialog.close();\n        });*/\n        //Se o utilizador carregar fora da box do Dialog optei por também fechar a box sem fazer nada\n        this.confirmClearTasksDialog.addEventListener('click', (event) => {\n            // Verifica se o clique foi no backdrop\n            if (event.target === this.confirmClearTasksDialog) {\n                this.confirmClearTasksDialog.close();\n            }\n        });\n    }\n    checkAllTasks() {\n        //Se houver tasks na lista fazemos a mudança (se não houver, nao permitimos checkar a box, porque está vazio)\n        if (this.taskManager.getTaskList().length !== 0) {\n            //Verificar se o botao esta checked ou nao, se estiver, chama o metodo para checkar todas, se nao tiver chama o metodo para descheckar todas (passamos argumento true ou false)\n            if (this.checkAllBtn.checked === true) {\n                this.taskManager.checkAllTasks(true);\n                this.renderTasks();\n            }\n            if (this.checkAllBtn.checked === false) {\n                this.taskManager.checkAllTasks(false);\n                this.renderTasks();\n            }\n        }\n        else {\n            this.checkAllBtn.checked = false;\n        }\n    }\n    renderTasks() {\n        this.taskList.innerHTML = \"\"; //Limpar tudo\n        this.taskManager.getTaskList().forEach((task) => {\n            const li = document.createElement(\"li\");\n            const label = document.createElement(\"label\");\n            const input = document.createElement(\"input\");\n            const span = document.createElement(\"span\");\n            const button = document.createElement(\"button\");\n            //Uma forma de fazer é esta (direta e funcional)\n            label.className = \"taskLabel\"; //define unicamente esta classe\n            input.type = \"checkbox\";\n            input.classList.add(\"taskCheckBtn\"); //adiciona esta classe (se já houver alguma lá, continua, fica com as duas)\n            input.checked = task.complete;\n            span.classList.add(\"taskText\");\n            span.textContent = task.task;\n            button.classList.add(\"taskDeleteBtn\");\n            button.title = \"Delete Task\";\n            button.ariaLabel = \"Delete Task\";\n            button.innerHTML = \"&#x2716;\";\n            /*Outra forma mais especifica é esta (setAttribute dá para todas as propriedades, mas normalmente usa-se para elementos nao gerais do dom, ex: data-*qualquerCoisa)\n            label.classList.add(\"taskLabel\");\n            input.setAttribute(\"type\", \"checkbox\");\n            input.classList.add(\"taskCheckBtn\");\n            span.classList.add(\"taskText\");\n            button.classList.add(\"taskDeleteBtn\");\n            button.setAttribute(\"title\", \"Delete Task\");\n            button.setAttribute(\"aria-label\", \"Delete Task\");\n            button.textContent = \"&#x2716;\";*/\n            /*Outra forma seria assim:\n            //\n                <label class=\"taskLabel\">\n                  <input type=\"checkbox\" class=\"taskCheckBtn\" ${task.complete ? \"checked\" : \"\">\n                  <span class=\"taskText\">${task.task}</span>\n                </label>\n                <button class=\"taskDeleteBtn\" title=\"Delete Task\" aria-label=\"Delete Task\">&#x2716;</button>\n      \n            //e fazer innerHTML à li (para HTML mais complexo, com muitos elementos, esta pode ser mais fácil para organizar)*/\n            //Adicionar os elementos na estrutura correta\n            label.appendChild(input);\n            label.appendChild(span);\n            li.appendChild(label);\n            li.appendChild(button);\n            this.taskList.appendChild(li);\n            //EventListener para a checkbox e botao de apagar de cada Task\n            input.addEventListener(\"change\", () => {\n                this.taskManager.changeTaskState(task.id);\n                this.renderTasks(); //Penso que fosse desnecessário porque o próprio html/css já muda o visual do input com o check\n            });\n            button.addEventListener(\"click\", () => {\n                this.taskManager.removeTask(task.id);\n                this.renderTasks();\n            });\n        });\n        //Limpar o checkbox geral (Check All) se todas as tasks forem/estiverem desselecionadas (false)\n        if (this.taskManager.getTaskList().every((task) => (task.complete === false))) {\n            this.checkAllBtn.checked = false;\n        }\n        //Limpar o checkbox geral (Check All) se a lista de tasks estiver vazia\n        if (this.taskManager.getTaskList().length === 0) {\n            this.checkAllBtn.checked = false;\n            //Aproveitar a verificaçao de lista vazia e adicionar um li vazio como se fosse um rodapé (só aparece se não houver tasks)\n            const li = document.createElement(\"li\");\n            this.taskList.appendChild(li);\n        }\n    }\n}\n\n\n//# sourceURL=webpack://typescript-project/./src/views/TaskUI.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;