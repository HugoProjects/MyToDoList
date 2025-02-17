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
  }

  //Métodos publicos podem ser acedidos fora da classe (os privados apenas podem ser acedidos dentro da classe, com o this.)
  public getTaskList(): Task[] {
    return this.taskList;
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
      complete: false
    };
  
    this.taskList.push(task);
    this.saveTasks();
  }

  public removeTask(taskID: string): void {

    this.taskList = this.taskList.filter((task) => task.id !== taskID); //Vai guardar apenas as tasks que tiverem um ID diferente da que queremos apagar
    this.saveTasks();
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

  



}

