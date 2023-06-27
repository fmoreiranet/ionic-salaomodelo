import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-perfil',
  templateUrl: './product-perfil.page.html',
  styleUrls: ['./product-perfil.page.scss'],
})
export class ProductPerfilPage implements OnInit {

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private activeRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getParam()
  }

  _id: string | null = null;
  product = new Product;
  imageSrc: string = "assets/icon/icon-box.svg"
  listPhotoProduct: string[] = [];

  getParam() {
    this._id = this.activeRouter.snapshot.paramMap.get("id");
    if (this._id) {
      this.productService.get(this._id).then(res => {
        this.product = <Product>res;
        if (Array.isArray(this.product.fotos)) {
          this.productService.getListPhoto(this.product)
            .then(res => {
              this.listPhotoProduct = res.fotos;
              this.imageSrc = this.listPhotoProduct[0];
            })
        }
      })
    }
  }

  setPhotoProduct(index: number) {
    console.log("Select:", index);
    this.imageSrc = this.listPhotoProduct[index];
  }

  async takePhoto(namePhoto: string, product: Product) {
    console.log("Take:", namePhoto);
    let index = this.listPhotoProduct.findIndex(p => namePhoto);
    if (index === -1) {
      index = this.listPhotoProduct.length;
    }
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    if (image.base64String) {
      let nameFile = Date.now().toString() + "." + image.format;
      await this.productService.setListPhoto(product, image.base64String, nameFile, index);
      await this.productService.getListPhoto(product).then(resProduct => {
        this.listPhotoProduct = resProduct.fotos;
        this.imageSrc = this.listPhotoProduct[index];
      })
    }
  }

  addPhoto(product: Product) {
    this.takePhoto('', product);
  }
}