import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  users!: User[];
  userSub!: Subscription;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.userService.getUsers().subscribe((user) => {
      this.users = user;
    });
  }
}
