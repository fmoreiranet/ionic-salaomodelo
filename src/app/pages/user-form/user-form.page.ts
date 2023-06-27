import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  user = new User()
  _id: string | null = null;

  ngOnInit() {
    this.getParam()
  }

  getParam() {
    this._id = this.activeRouter.snapshot.paramMap.get("id");
    if (this._id) {
      this.userService.get(this._id).then(res => {
        this.user = <User>res;
      })
    }
  }

  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      //subHeader: 'Important message',
      message: texto,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async save() {
    try {
      await this.userService.add(this.user)
        .then(async (res) => {
          console.log(res);
          this.presentAlert("Aviso", "Cadastrado");
          this.router.navigate(["/"]);
        })
        .catch((err) => {
          console.log(err);
          this.presentAlert("Erro", "Não cadastrado");
        })
    } catch (err) {
      this.presentAlert("Erro", "Sistema indisponível");
    }
  }

  async update() {
    try {
      if (!this._id) throw new Error("Sistema indisponível")
      await this.userService.update(this.user, this._id)
        .then((res) => {
          console.log(res);
          this.presentAlert("Aviso", "Atualizado");
          this.router.navigate(["/"]);
        })
        .catch((err) => {
          console.log(err);
          this.presentAlert("Erro", "Não atualizado");
        })
    } catch (error: Error | any) {
      console.error(error)
      this.presentAlert("Erro", "Error ao acessar o sistema");
    }
  }
}
