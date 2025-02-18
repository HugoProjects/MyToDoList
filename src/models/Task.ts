export default interface Task {
  id: string,
  task: string,
  date: number,
  complete: boolean
}

/*
export class TaskClass implements Task {
  constructor(
    public id: string,
    public task: string,
    public complete: boolean = false
  ) {}
}
  
*/