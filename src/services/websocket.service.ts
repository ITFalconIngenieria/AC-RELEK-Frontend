import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    webSocket: WebSocketSubject<any> = webSocket(environment.webSocketURL);
    interval: any;
    count: number;
    connectionId: string;
    public arrayData: any;
    constructor(private http: HttpClient){
        this.count = 0;
        this.connectionId = '';
    }

    getData(){
        this.webSocket.next({ action: 'connectLive' });
        console.log('Socket iniciado');
      }
    
      deleteConnection() {
        this.webSocket.next({ action: 'disconnectLive' });
        this.webSocket.subscribe(data => {});
      }
    
      destroySubscribe() {
        this.stopTimeout();
        this.webSocket.next({ action: 'disconnectLive' });
        this.webSocket.complete();
        console.log('Socket detenido');
    
      }
    
      stopTimeout() {
        clearInterval(this.interval);
      }
}