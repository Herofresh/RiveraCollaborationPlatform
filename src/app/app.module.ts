import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

const firebaseConfig = {
  apiKey: 'AIzaSyDlY8Vg96j7PCxWWw8jvJzvPN1kWTQTn2A',
  authDomain: 'messageboard-301910.firebaseapp.com',
  projectId: 'messageboard-301910',
  storageBucket: 'messageboard-301910.appspot.com',
  messagingSenderId: '2453259171',
  appId: '1:2453259171:web:764c41d9ab5edf5dee5016',
  measurementId: 'G-ZGT7DPGWRG',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
