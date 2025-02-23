import { TaskManager } from "../services/TaskManager";

export class TaskUI {

  private taskManager: TaskManager;
  private taskForm: HTMLFormElement;
  private inputText: HTMLInputElement;
  private clearCompletedTasksBtn: HTMLButtonElement;
  private confirmClearTasksDialog: HTMLDialogElement;
  private taskList: HTMLUListElement;
  private checkAllBtn: HTMLInputElement;
  private orderBySelect: HTMLSelectElement;
  private copyrightDateSpan: HTMLSpanElement;

  constructor() {
    this.taskManager = new TaskManager();
    this.taskForm = document.getElementById("taskForm") as HTMLFormElement;
    this.inputText = document.getElementById("taskInput") as HTMLInputElement;
    this.clearCompletedTasksBtn = document.getElementById("clearCompletedTasksBtn") as HTMLButtonElement;
    this.confirmClearTasksDialog = document.getElementById("confirmClearTasksDialog") as HTMLDialogElement;
    this.taskList = document.getElementById("list") as HTMLUListElement;
    this.checkAllBtn = document.getElementById("checkAllBtn") as HTMLInputElement;
    this.orderBySelect = document.getElementById("orderBySelect") as HTMLSelectElement;
    this.copyrightDateSpan = document.getElementById("copyrightDate") as HTMLSpanElement;

    this.initialize(); //Ao chamar o new TaskUI() inicializamos a class TaskUI com todas as suas propriedades e o construtor, que por sua vez irá usar este metodo initialize() para iniciar a aplicação
  }

  private initialize(){

    this.orderBySelect.value = this.taskManager.getUserPreferedOrder(); //Inicializar o select de ordenaçao com a opçao memorizada/favorita
    this.copyrightDateSpan.textContent = this.taskManager.getCopyrightDate();

    this.taskForm.addEventListener("submit", (event) => this.taskSubmit(event));
    this.clearCompletedTasksBtn.addEventListener("click", () => this.clearCompletedTasks());
    this.checkAllBtn.addEventListener("change", () => this.checkAllTasks());
    this.orderBySelect.addEventListener("change", () => this.renderTasks());
    this.renderTasks();
  }

  private taskSubmit(event: Event): void{
    event.preventDefault();

    const taskText = this.inputText.value.trim();
    //Se utilizador escreveu alguma coisa (ou seja, nao são espaços em branco)
    if(taskText){

      this.taskManager.addTask(taskText);
      this.inputText.value = "";
      this.renderTasks();
    } else {
      this.inputText.value = ""; //Se escreveu apenas espaços, apaga tudo para começar de novo
    }
  }

  private clearCompletedTasks(): void{
    //Como só usamos estes botões aqui não criei como propriedades da classe (instâncias da classe)
    //const yesBtn = document.getElementById("yesBtn") as HTMLButtonElement;
    //const noBtn = document.getElementById("yesBtn") as HTMLButtonElement;

    //Ativar o Dialog
    this.confirmClearTasksDialog.showModal();

    //Utilizando os botoes "Yes" e "No" como Submit, podemos usar a propriedade returnValue do Dialog para saber o que foi submetido com os botoes
    this.confirmClearTasksDialog.addEventListener("close", () => {

      //Se o utilizador carregou no "Yes" (automaticada o dialog faz close() depois do submit)
      if(this.confirmClearTasksDialog.returnValue === "Yes"){
        this.taskManager.clearCompletedTasks();
        this.checkAllBtn.checked = false; //Limpar o botao de check all
        this.renderTasks();
      }else{
        //Carregou no botão "No" portanto não queremos que aconteça nada
      }
    })

    /*Outra forma era escutar por cada um dos botões independentemente e agir de acordo com cada um
    yesBtn.addEventListener("click", () => {
      this.taskManager.clearTaskList();
      this.renderTasks();
      this.confirmClearTasksDialog.close();
    });

    noBtn.addEventListener("click", () => {
      this.confirmClearTasksDialog.close();
    });*/

    //Se o utilizador carregar fora da box do Dialog optei por também fechar a box sem fazer nada
    this.confirmClearTasksDialog.addEventListener('click', (event) => {
      // Verifica se o clique foi no backdrop
      if (event.target === this.confirmClearTasksDialog) {
        this.confirmClearTasksDialog.close();
      }
    });
  }

  private checkAllTasks(): void{

    //Se houver tasks na lista fazemos a mudança (se não houver, nao permitimos checkar a box, porque está vazio)
    if(this.taskManager.getTaskList().length !== 0){
      
      //Verificar se o botao esta checked ou nao, se estiver, chama o metodo para checkar todas, se nao tiver chama o metodo para descheckar todas (passamos argumento true ou false)
      if(this.checkAllBtn.checked === true){
        this.taskManager.checkAllTasks(true);
        this.renderTasks();
      }
      if(this.checkAllBtn.checked === false){
        this.taskManager.checkAllTasks(false);
        this.renderTasks();
      }
    }else{
      this.checkAllBtn.checked = false;
    }
  }

  private renderTasks(): void{

    this.taskList.innerHTML = ""; //Limpar tudo (visualmente), para desenhar novamente
    const taskListOrdenada = this.taskManager.orderTasksBy(this.orderBySelect.value); //Retorna a taskList pela ordem selecionada pelo utilizador (para ser apresentada de seguida)

    taskListOrdenada.forEach((task) => {
      const li = document.createElement("li") as HTMLLIElement;
      const label = document.createElement("label") as HTMLLabelElement;
      const input = document.createElement("input") as HTMLInputElement;
      const span = document.createElement("span") as HTMLSpanElement;
      const buttonEdit = document.createElement("button") as HTMLButtonElement;
      const buttonDelete = document.createElement("button") as HTMLButtonElement;

      //Uma forma de fazer é esta (direta e funcional)
      label.className = "taskLabel"; //define unicamente esta classe
      input.type = "checkbox";
      input.classList.add("taskCheckBtn"); //adiciona esta classe (se já houver alguma lá, continua, fica com as duas)
      input.checked = task.complete;
      span.classList.add("taskText");
      span.textContent = task.task;
      span.style.display = "inline-block";
      buttonDelete.classList.add("taskDeleteBtn");
      buttonDelete.title = "Delete Task";
      buttonDelete.ariaLabel = "Delete Task";
      buttonDelete.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
      buttonEdit.classList.add("taskEditBtn");
      buttonEdit.title = "Edit Task";
      buttonEdit.ariaLabel = "Edit Task";
      buttonEdit.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";

      /*Outra forma mais especifica é esta (setAttribute dá para todas as propriedades, mas normalmente usa-se para elementos nao gerais do dom, ex: data-*qualquerCoisa)
      label.classList.add("taskLabel");
      input.setAttribute("type", "checkbox");
      input.classList.add("taskCheckBtn");
      span.classList.add("taskText");
      buttonDelete.classList.add("taskDeleteBtn");
      buttonDelete.setAttribute("title", "Delete Task");
      buttonDelete.setAttribute("aria-label", "Delete Task");
      buttonDelete.textContent = "&#x2716;";*/

      /*Outra forma seria assim:
      //
          <label class="taskLabel">
            <input type="checkbox" class="taskCheckBtn" ${task.complete ? "checked" : "">
            <span class="taskText">${task.task}</span>
          </label>
          <button class="taskEditBtn" title="Edit Task" aria-label="Edit Task"><i class="fa-solid fa-pen"></i></button>
          <button class="taskDeleteBtn" title="Delete Task" aria-label="Delete Task">&#x2716;</button>

      //e fazer innerHTML à li (para HTML mais complexo, com muitos elementos, esta pode ser mais fácil para organizar)*/

      //Adicionar os elementos na estrutura correta
      label.appendChild(input);
      label.appendChild(span);

      li.appendChild(label);
      li.appendChild(buttonEdit);
      li.appendChild(buttonDelete);

      this.taskList.appendChild(li);

      //EventListener para a checkbox da task
      input.addEventListener("change", () => {
        this.taskManager.changeTaskState(task.id);
        this.renderTasks(); //Penso que fosse desnecessário porque o próprio html/css já muda o visual do input com o check
      });

      //Clicar no X para remover uma Task
      buttonDelete.addEventListener("click", () => {
        this.taskManager.removeTask(task.id);
        this.renderTasks();
      });

      //Clicar no botão Edit da Task
      buttonEdit.addEventListener("click", () => {

        //Para desativar o comportamento da label (está ligada à checkbox e ao input antigos se carregar nela)
        label.addEventListener('click', handleEvent);

        function handleEvent(event: Event) {
          event.preventDefault();
        }

        const saveEditBtn = document.createElement("button") as HTMLButtonElement;
        const divEdit = document.createElement("div") as HTMLParagraphElement;

        saveEditBtn.classList.add("taskSaveEditBtn");
        saveEditBtn.title = "Save";
        saveEditBtn.ariaLabel = "Save";
        saveEditBtn.innerHTML = "<i class=\"fa-solid fa-floppy-disk\"></i>";

        divEdit.textContent = task.task;
        divEdit.classList.add("taskEditDiv");
        divEdit.contentEditable = "true";

        label.replaceChild(saveEditBtn, input); //Troca o checkbox pelo botao de save
        label.replaceChild(divEdit, span); //Troca o span pela div de ediçao

        // Pequeno atraso para garantir que o focus funcione corretamente (a o cursor vá para o fim do texto depois do focus)
        setTimeout(() => {
          divEdit.focus();
          // Move o cursor para o final do conteúdo
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(divEdit);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }, 0);

        /*Precauçao: Antes de adicionar o novo listener, remova o antigo para evitar multiplicaçao de eventlisteners
        divEdit.removeEventListener("blur", funcao);
        saveEditBtn.removeEventListener("click", funcao);
        divEdit.removeEventListener("keydown", funcao);
        */

        // Se clicar fora desativa a edição (blur é perder o focus)
        divEdit.addEventListener("blur", (event) => {

          //Se a div perdeu o foco porque se carregou no botao de save
          if (event.relatedTarget === saveEditBtn) {
            divEdit.contentEditable = "false";
            this.taskManager.editTask(task.id, divEdit.innerText.trim());
            label.replaceChild(input, saveEditBtn); //Troca o checkbox pelo botao de save
            label.replaceChild(span, divEdit); //Troca a span pelo input text
            label.removeEventListener('click', handleEvent);
            this.renderTasks();
          }else{ //se foi por carregar noutro sitio qualquer, sai fora sem gravar nada
            divEdit.contentEditable = "false";
            label.replaceChild(input, saveEditBtn); //Troca o checkbox pelo botao de save
            label.replaceChild(span, divEdit); //Troca a span pelo input text
            label.removeEventListener('click', handleEvent);
          }
        });

        /*Se carregar no botao de save, guardar a alteração (não é necessário porque está a ser feito em cima)
        saveEditBtn.addEventListener("click", () => {
          divEdit.contentEditable = "false";
          this.taskManager.editTask(task.id, divEdit.innerText.trim());
          label.replaceChild(input, saveEditBtn); //Troca o checkbox pelo botao de save
          label.replaceChild(span, divEdit); //Troca a span pelo input text
          label.removeEventListener('click', handleEvent);
          this.renderTasks();
        });*/

        //Se carregar no enter, guardar a alteração
        divEdit.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
              event.preventDefault(); // Evita que o Enter crie uma nova linha

              //Timeout para garantir que faz todas as operaçoes
              //setTimeout(() => {
                //divEdit.contentEditable = "false";
                this.taskManager.editTask(task.id, divEdit.innerText.trim());
                label.replaceChild(input, saveEditBtn); //Troca o checkbox pelo botao de save
                label.replaceChild(span, divEdit); //Troca a span pelo input text
                label.removeEventListener('click', handleEvent);
                this.renderTasks();
              //}, 0);
          }
        });
      });
    });

    //Checkar automaticamente o checkbox geral (Check All) se todas as tasks estiverem completas / Limpar o checkbox geral se alguma task estiver a false
    if(this.taskManager.getTaskList().every((task) => (task.complete === true))){
      this.checkAllBtn.checked = true;
    }else{
      this.checkAllBtn.checked = false;
    }

    //Ações a fazer quando a Lista de Tasks estiver vazia []
    if(this.taskManager.getTaskList().length === 0){
      this.checkAllBtn.checked = false; //Limpar o checkbox geral (Check All)
      
      //Adicionar um li vazio como se fosse um rodapé (só aparece se não houver tasks) (visualmente mais bonito)
      const li = document.createElement("li") as HTMLLIElement;
      this.taskList.appendChild(li);

      //Limpar/Resetar o botão Select de Order By ?

    }
  }


}
