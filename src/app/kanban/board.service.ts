import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  private collectionName = 'boards';

  /**
   * Creates a new board for the current user
   * @param data Board to be created
   */
  async createBoard(data: Board) {
    const user = await this.afAuth.currentUser;
    return this.db.collection(this.collectionName).add({
      ...data,
      uid: user?.uid,
      tasks: [{ description: 'Hello!', label: 'yellow' }],
    });
  }

  /**
   * Deletes Board with this Id
   * @param boardId Id of the Boards
   */
  deleteBoard(boardId: string) {
    return this.db.collection(this.collectionName).doc(boardId).delete();
  }

  /**
   * Updates all tasks in Board
   * @param boardId Id of the Boards
   * @param tasks Task Array
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return this.db
      .collection(this.collectionName)
      .doc(boardId)
      .update({ tasks });
  }

  /**
   * Delete a single Task
   * @param boardId Id of the Boards
   * @param task Task to Remove
   */
  removeTask(boardId: string, task: Task) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firebase.default.firestore.FieldValue.arrayRemove(task),
      });
  }

  /**
   * Gets all Boards of the current User
   * They are ordered in ascending order according to the priority
   * If no user is logged in it returns an empty Array
   */
  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db
            .collection<Board>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   * @param boards Board Array to be Updated
   * (usually the boards of the current User)
   */
  sortBoards(boards: Board[]) {
    const db = firebase.default.firestore();
    const batch = db.batch();
    const refs = boards.map((b) =>
      db.collection(this.collectionName).doc(b.id)
    );
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
