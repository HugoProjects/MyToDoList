import { TaskUI } from "./views/TaskUI";

//Para garantir que o código dos scripts só é executado depois de carregar a página (HTML & CSS)
window.addEventListener("load", () => {
  const taskUI = new TaskUI();
  console.log(taskUI);
  //Bastava fazer new TaskUI() pois o construtor da classe trata de tudo e nao vou precisar de chamar métodos aqui, usando, por exemplo, taskUI.método1
});
