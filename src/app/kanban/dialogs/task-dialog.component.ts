import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../board.model';
import { BoardService } from '../board.service';

export interface TaskDialogInterface {
  task: Task;
  isNew: boolean;
  boardId?: string;
  idx?: number;
}

@Component({
  selector: 'app-task-dialog',
  template: `
    <h1 mat-dialog-title>Task</h1>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <textarea
          placeholder="Task description"
          matInput
          [(ngModel)]="data.task.description"
        ></textarea>
      </mat-form-field>
      <br />
      <mat-button-toggle-group
        #group="matButtonToggleGroup"
        [(ngModel)]="data.task.label"
      >
        <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
          <mat-icon [ngClass]="opt">{{
            opt === 'gray' ? 'check_circle' : 'lens'
          }}</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
        {{ data.isNew ? 'Add Task' : 'Update Task' }}
      </button>
      <app-delete-button
        *ngIf="!data.isNew"
        (delete)="handleTaskDelete()"
      ></app-delete-button>
    </div>
  `,
  styleUrls: ['./dialog.scss'],
})
export class TaskDialogComponent implements OnInit {
  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private ps: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogInterface
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete() {
    this.ps.removeTask(this.data.boardId!, this.data.task);
    this.dialogRef.close();
  }
}
