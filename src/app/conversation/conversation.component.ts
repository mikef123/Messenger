import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../service/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any[];
  shake: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService, private conversationService: ConversationService,
    private authenticationService: AuthenticationService, private angularFireStorage: AngularFireStorage) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    console.log(this.friendId);
    this.authenticationService.getStatus().subscribe((session) => {
      this.userService.getUserById(session.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        this.userService.getUserById(this.friendId).valueChanges().subscribe((data: User) => {
          this.friend = data;
          const ids = [this.user.uid, this.friend.uid].sort();
          this.conversation_id = ids.join('|');
          this.getConversation();
        }, (error) => {
          console.log(error);
        });
      });
    });
  }

  ngOnInit() {
  }
  sendMessage() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }
  sendZumbido() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: 'Has enviado un zumbido',
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message).then(() => { });
    this.doZumbido();
  }
  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }
  doNewMessage() {
    const audio = new Audio('assets/sound/new_message.m4a');
    audio.play();
  }
  getConversation() {
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe((data) => {
      this.conversation = data;
      this.conversation.forEach((message) => {
        if (!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);
          if(message.type == 'text') {
            this.doNewMessage();
          }
          else if (message.type == 'zumbido') {
            this.doZumbido();
          }
          else if (message.type == 'img') {
            this.doNewMessage();
            this.sendImage();
          }
        }
      });
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  getUserNickById(id) {
    if (id === this.friendId) {
      return this.friend.nick;
    }
    else {
      this.user.nick;
    }
  }

  sendImage(){
    const currentPictureId = Date.now();
    const pictures = this.angularFireStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
    pictures.then((result) => {
      this.picture = this.angularFireStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();
      this.picture.subscribe((picture) => {
        const message = {
          uid: this.conversation_id,
          timestamp: Date.now(),
          text: picture,
          sender: this.user.uid,
          receiver: this.friend.uid,
          type: 'img'
        };
        this.conversationService.createConversation(message).then(() => { });
        this.croppedImage = '';
        this.imageChangedEvent = '';
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}
}