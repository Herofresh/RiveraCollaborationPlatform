import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  @HostListener('click')
  onclick() {
    this.afAuth
      .signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
      .then((data) => {
        this.db.collection('user').doc(data.user?.uid).set(
          {
            email: data.user?.email,
            displayName: data.user?.displayName,
            photoUrl: data.user?.photoURL,
            uid: data.user?.uid,
          },
          { merge: true }
        );
      });
  }
}
