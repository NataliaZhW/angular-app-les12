import { Component } from '@angular/core';
import { TodoItem } from './models/todo-item';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './todo-form/todo-form';
import { TodoItemComponent } from './todo-item/todo-item';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  todos: TodoItem[] = [];
  filteredTodos: TodoItem[] = [];
  currentFilter: FilterType = 'all';
  
  private nextId = 1;

  constructor() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
      this.nextId = Math.max(0, ...this.todos.map(t => t.id)) + 1;
    }
    this.applyFilter();
  }

  addTodo(title: string): void {
    const newTodo: TodoItem = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date()
    };
    
    this.todos.push(newTodo);
    this.saveToLocalStorage();
    this.applyFilter();
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
      this.applyFilter();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveToLocalStorage();
    this.applyFilter();
  }

  editTodo(editData: {id: number, title: string}): void {
    const todo = this.todos.find(t => t.id === editData.id);
    if (todo) {
      todo.title = editData.title;
      this.saveToLocalStorage();
      this.applyFilter();
    }
  }

  moveTodo(moveData: {id: number, direction: 'up' | 'down'}): void {
    const index = this.todos.findIndex(t => t.id === moveData.id);
    if (index === -1) return;

    if (moveData.direction === 'up' && index > 0) {
      [this.todos[index - 1], this.todos[index]] = [this.todos[index], this.todos[index - 1]];
    } else if (moveData.direction === 'down' && index < this.todos.length - 1) {
      [this.todos[index], this.todos[index + 1]] = [this.todos[index + 1], this.todos[index]];
    }
    
    this.saveToLocalStorage();
    this.applyFilter();
  }

  deleteCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed);
    this.saveToLocalStorage();
    this.applyFilter();
  }

  setFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    switch (this.currentFilter) {
      case 'active':
        this.filteredTodos = this.todos.filter(t => !t.completed);
        break;
      case 'completed':
        this.filteredTodos = this.todos.filter(t => t.completed);
        break;
      default:
        this.filteredTodos = [...this.todos];
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  get activeCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }
}