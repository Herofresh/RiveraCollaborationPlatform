import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MessageRoutingModule } from './message-routing.module';
import { MessageboardComponent } from './messageboard/messageboard.component';
import { SharedModule } from '../shared/shared.module';
import { MessageDialogComponent } from './dialogs/message-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MessageboardComponent, MessageDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MessageRoutingModule,
    ScrollingModule,
    FormsModule,
  ],
})
export class MessageModule {}
