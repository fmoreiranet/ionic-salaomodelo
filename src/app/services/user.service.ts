import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, getDoc, query, getDocs, doc, updateDoc,
  deleteDoc, where, setDoc,
} from '@angular/fire/firestore';
import {
  Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut,
} from '@angular/fire/auth';

import { Storage, getDownloadURL, getStorage, ref, uploadBytesResumable, uploadString } from '@angular/fire/storage';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private router: Router) { }
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  private readonly storage: Storage = inject(Storage);
  private userCollection = collection(this.firestore, 'users');

  async add(user: User) {
    await createUserWithEmailAndPassword(this.auth, user.email, user.senha)
      .then((resAuth) => {
        return this.addUser(user, resAuth.user.uid).catch(async (err) => {
          await this.auth.currentUser?.delete();
        });
      })
      .catch(async (erroAuth) => {
        await this.auth.currentUser?.delete();
      });
  }

  addUser(user: User, idDoc: string = '') {
    //delete user._id;
    //return addDoc(this.userCollection, <User>{...user})
    return setDoc(doc(this.firestore, 'users/' + idDoc), <User>{
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      //senha: user.senha,
      ativo: user.ativo,
    });
  }

  async list() {
    //return collectionData(query(this.userCollection));
    const result = await getDocs(
      query(this.userCollection, where('ativo', '==', true))
    );
    return result.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  }

  async get(id: string) {
    const result = await getDoc(doc(this.firestore, 'users', id));
    //return result.data()
    return { _id: result.id, ...result.data() };
  }

  async update(user: User, id: string) {
    const result = await updateDoc(doc(this.firestore, 'users', id), {
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      senha: user.senha,
    });
    return result;
  }

  async delete(id: string) {
    //return await deleteDoc(doc(this.firestore, 'users', id));
    const result = await updateDoc(doc(this.firestore, 'users', id), {
      ativo: false,
    });
    return result;
  }

  async login(email: string, senha: string) {
    return await signInWithEmailAndPassword(this.auth, email, senha)
  }

  async logoff() {
    return await signOut(this.auth)
  }

  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider)
  }

  async setPhotoPerfil(imgName: string, imgBase64: string, id: string) {
    const storageRef = ref(this.storage, "user/" + imgName);
    return await uploadString(storageRef, imgBase64, "base64")
      .then(async res => {
        const result = await updateDoc(doc(this.firestore, 'users', id), {
          foto: res.ref.fullPath
        });
      })
  }

  async getProtoPerfil(imgRef: string) {
    const storage = getStorage();
    return await getDownloadURL(ref(storage, imgRef))
  }

  async getCurrentUser() {
    return await this.auth.currentUser
  }
}
