import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Storage, getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  private repository = 'products';
  private readonly storage: Storage = inject(Storage);
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  private collection = collection(this.firestore, this.repository);

  add(product: Product) {
    Object.arguments.delete(product._id)
    return addDoc(this.collection, <Product>{
      ...product
    })
  }

  async list() {
    const result = await getDocs(query(this.collection));
    return result.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  }

  async get(id: string) {
    const result = await getDoc(doc(this.firestore, this.repository, id))
    return { _id: result.id, ...result.data() }
  }

  async update(product: Product, id: string) {
    product._id = '';
    const result = await updateDoc(doc(this.firestore, this.repository, id), {
      ...product
    });
    return result;
  }

  async delete(id: string) {
    const result = await updateDoc(doc(this.firestore, this.repository, id), {
      ativo: false,
    });
    return result;
  }

  async setPhotoPerfil(imgName: string, imgBase64: string) {
    const storageRef = ref(this.storage, this.repository + "/" + imgName);
    return await uploadString(storageRef, imgBase64, "base64")
  }

  async getProtoPerfil(imgRef: string) {
    const storage = getStorage();
    return await getDownloadURL(ref(storage, imgRef))
  }

  async setListPhoto(product: Product, newPhoto: string, index: number, id: string) {
    this.setPhotoPerfil(product.fotos[index], newPhoto)
      .then(async resPhoto => {
        product.fotos[index] = resPhoto.ref.fullPath;
        const result = await updateDoc(doc(this.firestore, this.repository, id), {
          fotos: product.fotos
        });
        return result;
      })
  }

  async getListPhoto(product: Product) {
    try {
      if (Array.isArray(product.fotos)) {
        await this.getProtoPerfil(product.fotos[0])
          .then(res => {
            product.fotos[0] = res
          }).catch(error => {
            throw new Error("");
          })
      }
    } catch (error) {
      product.fotos[0] = "assets/icon/icon-box.svg"
    }
    return product
  }
}
