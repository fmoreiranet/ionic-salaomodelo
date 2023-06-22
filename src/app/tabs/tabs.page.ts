import { Component } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private userService: UserService
  ) { }
  user = new User;
  imageUser = "assets/perfil-user.webp";

  async ionViewWillEnter() {
    await this.userService.getCurrentUser()
      .then(async res => {
        if (res) {
          await this.userService.get(res.uid)
            .then(async resUser => {
              this.user = <User>resUser
              this.user._id = res.uid
              await this.userService.getProtoPerfil(this.user.foto)
                .then(resPhoto => {
                  this.imageUser = resPhoto;
                })
                .catch(errPhoto => {
                  console.log(errPhoto);
                  this.imageUser = "assets/perfil-user.webp";
                })
            })
        }
      })
  }
}
