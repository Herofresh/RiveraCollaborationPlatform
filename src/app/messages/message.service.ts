import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Message } from './message.model';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public theEnd = new BehaviorSubject(false);

  private collectionName = 'messages';
  private batchSize = 20;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Creates a new Message for the current user
   * @param data Header and Text of Message
   */
  async addMessage(data: Message) {
    const user = await this.afAuth.currentUser;
    return this.db.collection(this.collectionName).add({
      ...data,
      uid: user?.uid,
      email: user?.email,
      createdAt: firebase.default.firestore.Timestamp.fromDate(new Date()),
    });
  }

  /**
   * Gets Batches of 20 for infinite Scroll Component
   * @param lastSeen Last Element of Current Array
   */
  getBatch(lastSeen: any) {
    return this.db
      .collection(this.collectionName, (ref) =>
        ref.orderBy('createdAt').startAfter(lastSeen).limit(this.batchSize)
      )
      .snapshotChanges()
      .pipe(
        tap((arr) => (arr.length ? null : this.theEnd.next(true))),
        map((arr) => {
          return arr.reduce(
            (
              acc: any,
              cur: { payload: { doc: { id: any; data: () => any } } }
            ) => {
              const id = cur.payload.doc.id;
              const data = cur.payload.doc.data();
              return { ...acc, [id]: data };
            },
            {}
          );
        })
      );
  }
}
