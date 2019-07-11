import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = "";
  constructor(private userService: UserService, private authenticationService: AuthenticationService,
    private router:Router) {
    this.userService.getUsers().valueChanges()
    .subscribe((data: User[])=>{
      this.friends= data;
    },(error) => {
      console.log(error);
    })
   }

  ngOnInit() {
  }

  logOut() {
    this.authenticationService.logOut().then(()=>{
      alert('Sesión cerrada');
      this.router.navigate(['login']);
    },(error)=>{
      console.log(error);
    });
  }

}
