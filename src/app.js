import {Todo} from './todo';

export class App {
	constructor() {
		this.heading = "Todo List";
		this.todos = [];
		this.pendingTodo = '';
	}

	addTodo() {
		if (this.pendingTodo) {
			this.todos.push(new Todo(this.pendingTodo));
			this.pendingTodo = '';
		}
	}

	removeTodo(todo) {
		let index = this.todos.indexOf(todo);
		if (-1 !== index)
			this.todos.splice(index, 1);
	}
}