import Task from "../models/Task";

export class TaskManager {

  private taskList: Task[]; //Declarar a lista

  constructor() {
    this.taskList = this.loadTasks(); //Inicializar/Criar Lista de tarefas (importar uma ja guardada na localStorage ou criar uma nova/vazia)
  }

  private loadTasks(): Task[] {

    const storedList: string | null = localStorage.getItem("taskList"); //Ler a lista guardada na LocalStorage, pode existir ou nao

    if(storedList){
      return JSON.parse(storedList);
    } else {
      return []; //Criar uma lista de tarefas vazia para o caso de nao existir nenhuma guardada
    }
  }

  private saveTasks(): void {
    localStorage.setItem("taskList", JSON.stringify(this.taskList));
    console.log(this.taskList);
  }

  private saveUserPreferedOrder(orderBy: string): void {
    localStorage.setItem("orderBy", orderBy);
  }

  //Métodos publicos podem ser acedidos fora da classe (os privados apenas podem ser acedidos dentro da classe, com o this.)
  public getTaskList(): Task[] {
    return this.taskList;
  }

  public getUserPreferedOrder(): string {
    const orderSaved: string = localStorage.getItem("orderBy") || "Order-by"; //Ler a preferencia de ordem de apresentaçao das tasks (se não tiver nenhuma, devolve a default)
    return orderSaved;
  }

  public getCopyrightDate(): string {
    const year = new Date().getFullYear();
    return year.toString(); //Devolver como string em vez de number (que vem como default de Date)
  }

  public changeTaskState(id: string): void {
    const taskToChange = this.taskList.find(task => task.id === id);

    if (taskToChange) {
      taskToChange.complete = !taskToChange.complete;
      this.saveTasks();
    }
  }

  public addTask(taskInputText: string): void {

    const task: Task = {
      id: `${taskInputText.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      task: taskInputText,
      dateOfCreation: Date.now(), //Este método guarda os millisegundos passados desde 1970 até ao momento. Para mostrar a data num formato legível, usar o const dataFormatada = new Date(task.dateOfCreation).toLocaleString("pt-PT") por exemplo, ou outro semelhante
      complete: false
    };
  
    this.taskList.push(task);
    this.saveTasks();
  }

  public removeTask(taskID: string): void {

    this.taskList = this.taskList.filter((task) => task.id !== taskID); //Vai guardar apenas as tasks que tiverem um ID diferente da que queremos apagar
    this.saveTasks();
  }

  public editTask(taskID: string, taskText: string) {

    //Se o utilizador tiver feito alterações, grava as mesmas na task, se tiver apagado todo o texto (null ou apenas espaços em branco) remove-se a task
    if(taskText){
      const taskToEdit: Task = this.taskList.find((task) => task.id === taskID)!; //O ! é para o TypeScript não dar erro, estamos a dizer que temos a certeza que o find vai retornar um objeto (nunca sera undefined)
      taskToEdit.task = taskText;
      this.saveTasks();
    } else {
      this.removeTask(taskID);
    }
  }

  public clearTaskList(): void {
    this.taskList = [];
    this.saveTasks();
    //localStorage.removeItem("taskList");
  }

  public clearCompletedTasks(): void {
    this.taskList = this.taskList.filter((task)=> {
      return task.complete !== true;
    });
    this.saveTasks();
  }

  //Muda o estado para todas completas ou muda para todas incompletas
  public checkAllTasks(checkState: boolean): void {

    //Verificar se a checkbox esta selecionada ou nao (true ou false, passado como argumento no TaskUI)
    if(checkState){
      this.taskList.forEach((task) => {
        return task.complete = true; //Coloca todas a true
      });
      //console.log("colocou todas a true");
    }else{
      this.taskList.forEach((task) => {
        return task.complete = false; //Coloca todas a falso
      });
      //console.log("colocou todas a false");
    }
    this.saveTasks();
  }

  //Devolver o array de Tasks ordenado por uma ordem escolhida pelo utilizador (conserva o array default)
  public orderTasksBy(orderBy: string): Task[] {

    //Guarda a preferencia de ordenaçao do utilizador para no futuro iniciar com a mesma
    this.saveUserPreferedOrder(orderBy);

    // Criar uma cópia do array antes de ordenar (o array original fica intacto)
    const taskListCopy = [...this.getTaskList()]; // ou this.getTaskList().slice()
    //console.log("copia do taskList:",taskListCopy);

    switch (orderBy) {
        case "Alphabetical":
            return taskListCopy.sort((a, b) => a.task.localeCompare(b.task)); //localeCompare compara a string a com a b (ordena de A-Z) (ou ao contrário se fizer de b com a)
        case "Newest":
            return taskListCopy.sort((a, b) => b.dateOfCreation - a.dateOfCreation); //Mais recente ao mais antigo
        case "Completed":
          /*Só ordena se houver alguma task completa, senão nao ordena nada (neste caso nao funciona porque devolve sempre a lista original (oldest) porque estamos a trabalhar com uma copia do array, nunca alteramos o original)
          if(taskListCopy.some((task) => task.complete === true)){*/
          return taskListCopy.sort((a, b) => {
            if (a.complete === b.complete) return 0;  // Caso ambas sejam iguais mantem a ordem
            return a.complete ? -1 : 1;  // Tarefa completa vem primeiro
          });
        case "Not-Completed":
          return taskListCopy.sort((a, b) => {
            if (a.complete === b.complete) return 0;  // Caso ambas sejam iguais mantem a ordem
            return a.complete ? 1 : -1;  // Tarefa nao completa vem primeiro
          });
        default: //"Oldest" que basicamente é o que vai adicionando ao fim da fila com o push
            return this.getTaskList(); //Devolvemos a lista original, que seria o mesmo que ordenar por mais antigo ao mais recente com taskListCopy.sort((a, b) => a.dateOfCreation - b.dateOfCreation)
    }
  }

}


// Dark Mode (media query & button to change)