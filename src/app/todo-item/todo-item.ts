import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TodoItem } from '../models/todo-item';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemComponent {
  @Input() item!: TodoItem;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{id: number, title: string}>();
  @Output() move = new EventEmitter<{id: number, direction: 'up' | 'down'}>();

  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  isEditing = false;
  editTitle = '';

  onToggle(): void {
    this.toggle.emit(this.item.id);
  }

  onDelete(): void {
    this.delete.emit(this.item.id);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.item.title;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    });
  }

  saveEdit(): void {
    if (this.editTitle.trim()) {
      this.edit.emit({id: this.item.id, title: this.editTitle.trim()});
      this.isEditing = false;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = '';
  }

  moveUp(): void {
    this.move.emit({id: this.item.id, direction: 'up'});
  }

  moveDown(): void {
    this.move.emit({id: this.item.id, direction: 'down'});
  }
}