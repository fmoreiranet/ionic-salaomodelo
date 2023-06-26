import { Component } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  user = new User

  // https://ionicframework.com/docs/angular/lifecycle
  ionViewWillEnter() {
    let currentAuth = this.userService.getIdCurrentUser()
    if (currentAuth) {
      currentAuth.onAuthStateChanged(res => {
        if (res) {
          this.userService.get(res?.uid)
            .then(async resUser => {
              console.log(resUser);
              this.user = resUser;
              this.user._id = res.uid;
              await this.userService.getProtoPerfil(this.user.foto)
                .then(resProto => this.user.foto = resProto);
            })
        }
      })
    }
  }
}
