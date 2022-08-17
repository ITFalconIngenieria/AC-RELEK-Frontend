import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/services/websocket.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  destroyed = new Subject<void>();
  estado1=false;
  estado2=true;

  constructor(
    private webSocketService: WebsocketService
  ) { }

  ngOnInit() {
    this.webSocketService.getData();
    this.webSocketService.webSocket.subscribe(data =>{
      console.log(data)
      this.webSocketService.interval = setInterval(() => {
        this.webSocketService.getData();
      }, 10000);
    })
  }

  ngOnDestroy(){
    this.webSocketService.destroySubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
