import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  webSocket: WebSocketSubject<any> = webSocket(environment.webSocketURL);

  constructor() {}

  connect() {
    console.log(this.webSocket);
    
    return this.webSocket
  }

  disconect(){
    this.webSocket.next({ action: 'disconnectLive' });
    this.webSocket.complete();
  }
}