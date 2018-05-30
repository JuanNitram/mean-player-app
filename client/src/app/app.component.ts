import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService] // SE CARGAN TODOS LOS SERVICIOS QUE QUERAMOS
})

export class AppComponent implements OnInit {
  title = 'MUSICA LIBRE';
  public user: User;
  public identity;
  public token;
  public errorMessage;


  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {

  }

  public onSubmit() {
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
        var identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('El usuario no esta correctamente identificado!');
        } else {
          // Crear elemento en el localstorage para tener al usuario en sesion


          // Conseguir el token para enviarselo a cada peticion http
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              var token = response.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert('El Token no se ha generado!');
              } else {
                // Crear un elemento en ele localstorage para tener token disponible
                console.log(token);
                console.log(identity);

              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
}
