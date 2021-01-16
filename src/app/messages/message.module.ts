import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageboardRoutingModule } from './message-routing.module';
import { MessageboardComponent } from './messageboard/messageboard.component';

@NgModule({
  declarations: [MessageboardComponent],
  imports: [CommonModule, MessageboardRoutingModule],
})
export class MessageModule {}
