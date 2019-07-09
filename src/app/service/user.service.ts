import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  friends: User[];
  constructor() { 
    let usuario1: User = {
      nick: 'Eduardo',
      age: 24,
      status: "add",
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario2: User = {
      nick: 'Freddy',
      age: 28,
      status: "online",
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 2
    };
    let usuario3: User = {
      nick: 'Yuliana',
      age: 18,
      status: "busy",
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 3
    };
    let usuario4: User = {
      nick: 'Ricardo',
      age: 17,
      status: "away",
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 4
    };
    let usuario5: User = {
      nick: 'Marcos',
      age: 30,
      status: "away",
      email:'marcos@aoe.aoe',
      friend: false,
      uid: 5
    };
    this.friends = [usuario1,usuario2,usuario3,usuario4,usuario5];
  }

  getFriends(){
    return this.friends;
  }
}
