import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.page.html',
  styleUrls: ['./user-perfil.page.scss'],
})
export class UserPerfilPage implements OnInit {

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getParam()
  }

  user = new User;
  _id: string | null = null;
  imageSrc: string | undefined;

  getParam() {
    this._id = this.activatedRouter.snapshot.paramMap.get("id");
    if (this._id) {
      this.userService.get(this._id).then(async res => {
        this.user = <User>res;
        if (this.user.foto) {
          await this.userService.getProtoPerfil(this.user.foto)
            .then(res => {
              this.imageSrc = res
            })
        } else {
          this.imageSrc = "assets/perfil.webp"
        }
      })
    }
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    // const imageUrl = image.webPath;
    // this.imageSrc = imageUrl;
    // this.user.foto = this.imageSrc ? this.imageSrc : "";
    console.log(image)

    if (image.base64String && this._id) {
      let nameFile = Date.now().toString() + "." + image.format;
      await this.userService.setPhotoPerfil(nameFile, image.base64String, this._id)
      await this.userService.getProtoPerfil("user/" + nameFile)
        .then(resUrl => {
          this.imageSrc = resUrl
        })
    }
  }

  async logoff() {
    await this.userService.logoff().then(() => {
      this.router.navigate(["/"])
    });
  }

}
