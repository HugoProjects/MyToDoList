import { TaskManager } from "../services/TaskManager";

export class TaskUI {

  private taskManager: TaskManager;
  private taskForm: HTMLFormElement;
  private inputText: HTMLInputElement;
  private clearCompletedTasksBtn: HTMLButtonElement;
  private confirmClearTasksDialog: HTMLDialogElement;
  private taskList: HTMLUListElement;
  private checkAllBtn: HTMLInputElement;

  constructor() {
    this.taskManager = new TaskManager();
    this.taskForm = document.getElementById("taskForm") as HTMLFormElement;
    this.inputText = document.getElementById("taskInput") as HTMLInputElement;
    this.clearCompletedTasksBtn = document.getElementById("clearCompletedTasksBtn") as HTMLButtonElement;
    this.confirmClearTasksDialog = document.getElementById("confirmClearTasksDialog") as HTMLDialogElement;
    this.taskList = document.getElementById("list") as HTMLUListElement;
    this.checkAllBtn = document.getElementById("checkAllBtn") as HTMLInputElement;

    this.initialize(); //Ao chamar o new TaskUI() inicializamos a class TaskUI com todas as suas propriedades e o construtor, que por sua vez irá usar este metodo initialize() para iniciar a aplicação
  }

  private initialize(){

    this.taskForm.addEventListener("submit", (event) => this.taskSubmit(event));
    this.clearCompletedTasksBtn.addEventListener("click", () => this.clearCompletedTasks());
    this.checkAllBtn.addEventListener("change", () => this.checkAllTasks());
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

    this.taskList.innerHTML = ""; //Limpar tudo

    this.taskManager.getTaskList().forEach((task) => {

      const li = document.createElement("li") as HTMLLIElement;
      const label = document.createElement("label") as HTMLLabelElement;
      const input = document.createElement("input") as HTMLInputElement;
      const span = document.createElement("span") as HTMLSpanElement;
      const button = document.createElement("button") as HTMLButtonElement;

      //Uma forma de fazer é esta (direta e funcional)
      label.className = "taskLabel"; //define unicamente esta classe
      input.type = "checkbox";
      input.classList.add("taskCheckBtn"); //adiciona esta classe (se já houver alguma lá, continua, fica com as duas)
      input.checked = task.complete;
      span.classList.add("taskText");
      span.textContent = task.task;
      button.classList.add("taskDeleteBtn");
      button.title = "Delete Task";
      button.ariaLabel = "Delete Task";
      button.innerHTML = "&#x2716;";

      /*Outra forma mais especifica é esta (setAttribute dá para todas as propriedades, mas normalmente usa-se para elementos nao gerais do dom, ex: data-*qualquerCoisa)
      label.classList.add("taskLabel");
      input.setAttribute("type", "checkbox");
      input.classList.add("taskCheckBtn");
      span.classList.add("taskText");
      button.classList.add("taskDeleteBtn");
      button.setAttribute("title", "Delete Task");
      button.setAttribute("aria-label", "Delete Task");
      button.textContent = "&#x2716;";*/

      /*Outra forma seria assim:
      //
          <label class="taskLabel">
            <input type="checkbox" class="taskCheckBtn" ${task.complete ? "checked" : "">
            <span class="taskText">${task.task}</span>
          </label>
          <button class="taskDeleteBtn" title="Delete Task" aria-label="Delete Task">&#x2716;</button>

      //e fazer innerHTML à li (para HTML mais complexo, com muitos elementos, esta pode ser mais fácil para organizar)*/

      //Adicionar os elementos na estrutura correta
      label.appendChild(input);
      label.appendChild(span);

      li.appendChild(label);
      li.appendChild(button);

      this.taskList.appendChild(li);

      //EventListener para a checkbox e botao de apagar de cada Task
      input.addEventListener("change", () => {
        this.taskManager.changeTaskState(task.id);
        this.renderTasks(); //Penso que fosse desnecessário porque o próprio html/css já muda o visual do input com o check
      });

      button.addEventListener("click", () => {
        this.taskManager.removeTask(task.id);
        this.renderTasks();
      });
    })

    //Limpar o checkbox geral (Check All) se todas as tasks forem/estiverem desselecionadas (false)
    if(this.taskManager.getTaskList().every((task) => (task.complete === false))){
      this.checkAllBtn.checked = false;
    }

    //Limpar o checkbox geral (Check All) se a lista de tasks estiver vazia
    if(this.taskManager.getTaskList().length === 0){
      this.checkAllBtn.checked = false;
      
      //Aproveitar a verificaçao de lista vazia e adicionar um li vazio como se fosse um rodapé (só aparece se não houver tasks)
      const li = document.createElement("li") as HTMLLIElement;
      this.taskList.appendChild(li);
    }
  }

}