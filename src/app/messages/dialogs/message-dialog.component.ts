import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  template: `<h1 mat-dialog-title>Board</h1>
    <div mat-dialog-content>
      <p>What do you want to say?</p>
      <mat-form-field>
        <input placeholder="title" matInput [(ngModel)]="data.header" />
      </mat-form-field>
      <mat-form-field>
        <input placeholder="text" matInput [(ngModel)]="data.text" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button
        mat-button
        [mat-dialog-close]="{ header: data.header, text: data.text }"
        cdkFocusInitial
      >
        Create
      </button>
    </div>`,
  styles: [],
})
export class MessageDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
}
