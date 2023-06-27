import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { error } from 'console';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getList();
  }

  products: Product[] = [];

  async getList() {
    this.productService.list()
      .then(async res => {
        console.log(res)
        this.products = <Product[]>res;
        for (let product of this.products) {
          await this.productService.getListPhoto(product).then(resList => {
            product.fotos = resList.fotos;
          });
        }
      })
  }

  openProductPerfil(id: string) {
    this.router.navigate(["/tabs/productPerfil", id]);
  }
}
