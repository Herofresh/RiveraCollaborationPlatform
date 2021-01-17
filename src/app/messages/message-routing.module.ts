import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageboardComponent } from './messageboard/messageboard.component';

const routes: Routes = [{ path: '', component: MessageboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageRoutingModule {}
