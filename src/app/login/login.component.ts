import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email:string = null;
  password:string = null;
  nick:string = null;
  constructor(private authenticationService: AuthenticationService, private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  login(){
   this.authenticationService.loginWithEmail(this.email, this.password)
    .then((data) => {
      alert("loggeado correctamente");
      console.log(data);
      this.router.navigate(['home']);
    })
    .catch((error) => {
      alert("Ocurrio un error");
      console.log(error);
    });
  } 
  register(){
   this.authenticationService.registerWithEmail(this.email, this.password)
    .then((data) => {
      const user = {
        uid: data.user.uid,
        email: this.email,
        nick: this.nick
      };
      this.userService.createUser(user).then((data2) => {
      }).catch((error)=> {
        alert("registrado correctamente");
        console.log(data);
      })
    })
    .catch((error) => {
      alert("Ocurrio un error");
      console.log(error);
    });
  } 

}
