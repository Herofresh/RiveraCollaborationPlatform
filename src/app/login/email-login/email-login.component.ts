import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  form!: FormGroup;

  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;

  serverMessage = '';

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', []],
    });
  }

  changeType(val: 'login' | 'signup' | 'reset') {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get canReset() {
    if ((this.type = 'reset')) return this.email?.valid;
    else return false;
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      if (this.password && this.passwordConfirm) {
        return this.password.value === this.passwordConfirm.value;
      } else {
        return false;
      }
    }
  }

  async onSubmit() {
    this.loading = true;
    const email = this.email?.value;
    const password = this.password?.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup) {
        await this.afAuth
          .createUserWithEmailAndPassword(email, password)
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
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Check your email';
      }
    } catch (err) {
      this.serverMessage = err;
    }
    this.loading = false;
  }
}
