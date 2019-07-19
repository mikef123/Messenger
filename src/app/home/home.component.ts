import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = "";
  friendEmail: string="";
  user:User;
  constructor(private userService: UserService, private authenticationService: AuthenticationService,
    private router:Router, private modalService: NgbModal, private requestService: RequestService) {
    this.userService.getUsers().valueChanges()
    .subscribe((data: User[])=>{
      this.friends= data;
    },(error) => {
      console.log(error);
    });
    this.authenticationService.getStatus().subscribe((status)=>{
      this.userService.getUserById(status.uid).valueChanges().subscribe((data:User)=>{
        this.user= data;
        if(this.user.friends) {
          this.user.friends = Object.values(this.user.friends);
          console.log(this.user);
        }
      });
    });
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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
      
    });
  }
  sendRequest() {
    const request = {
      timestamp:Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    };
    this.requestService.createRequest(request).then(()=>{
      alert('Solicitud enviada');
    }).catch((error)=> {
      alert('Hubo un error');
      console.log(error);
    });
  }

}
