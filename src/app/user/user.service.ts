import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  getUsers() {
    return this.db.collection<User>('user').valueChanges();
  }

  getUser(uid: string) {
    return this.db
      .collection<User>('user', (ref) => ref.where('uid', '==', uid))
      .valueChanges();
  }
}
