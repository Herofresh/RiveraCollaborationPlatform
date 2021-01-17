import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/messages/message.model';
import { MessageService } from 'src/app/messages/message.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user!: User;
  public userSub!: Subscription;
  public messages: any[] = [];
  public messagesSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const uid = this.route.snapshot.params.uid;

    this.userSub = this.userService.getUser(uid).subscribe((user) => {
      this.user = user[0];
    });

    this.messagesSub = this.messageService
      .getMessagesFromUser(uid)
      .subscribe((messages) => {
        this.messages = messages.map((v) => {
          return v.payload.doc.data();
        });
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
