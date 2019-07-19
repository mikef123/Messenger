import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/service/user.service';
import { RequestService } from 'src/app/services/request.service';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface PromptModel {
  scope: any;
  currentRequest: any
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel {
    scope: any;
    shouldAdd: string = 'yes';
    currentRequest: any;
    userSend: User;
  
  constructor(public dialogService: DialogService, private userService:UserService, 
    private requestService: RequestService, private authenticacionService: AuthenticationService) { 
    super(dialogService)

    this.authenticacionService.getStatus().subscribe( (status) => {
      this.userService.getUserById(status.uid).valueChanges().subscribe( (data:User) => {
        this.userSend = data;
        console.log(this.userSend);
      },(error) => {
        console.log(error);
      });
    },(error) => {
      console.log(error);
    });
  }
  
  accept() {
    if(this.shouldAdd == 'yes') {
      this.requestService.setRequestStatus(this.currentRequest, 'accepted')
      .then((data)=> {
        console.log(data);
        this.userService.addFriend(this.scope.user.uid, this.currentRequest.sender)
        .then(()=> {
          alert('Solicitud aceptada con exito')
        });
      })
      .catch((error)=> {
        console.log(error);
      })
    } else if(this.shouldAdd == 'no') {
      this.requestService.setRequestStatus(this.currentRequest, 'rejected')
      .then((data)=> {
        console.log(data);
      })
      .catch((error)=> {
        console.log(error);
      })
    }else if(this.shouldAdd == 'later') {
      this.requestService.setRequestStatus(this.currentRequest, 'decide_later')
      .then((data)=> {
        console.log(data);
      })
      .catch((error)=> {
        console.log(error);
      });
    }
  }
}
