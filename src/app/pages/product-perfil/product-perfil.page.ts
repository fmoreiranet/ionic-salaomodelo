import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  product = new Product;
  _id: string | null = null;
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
            })
        }
      })
    }
  }
}
