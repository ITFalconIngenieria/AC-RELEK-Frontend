import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/services/websocket.service';
import { Subject } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { IOTData } from '../../models/IOTData';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  destroyed = new Subject<void>();
  estado1: boolean;
  estado2: boolean;
  colorAC1= "#50D050"
  colorAC2= "gray"
  interval: any;
  data: any;
  IotData: IOTData = {
    AC1_ON: 0,
    AC2_ON: 0,
    CMD_OFF_AC1: 0,
    CMD_OFF_AC2: 0,
    CMD_ON_AC1: 0,
    CMD_ON_AC2: 0,
    DISPARO_AC1: 0,
    DISPARO_AC2: 0,
    Prueba1: 0,
  }
  constructor(
    private webSocketService: WebsocketService,
    private dataService: DataService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initIotData();
    this.validateACState();
    this.data = this.webSocketService.connect();
    this.data.next({ action: 'connectLive' });
    this.data.subscribe((data: any) => {
      if (data.Items) {
        
        this.IotData = data.Items;
        console.log('IOT DATA');
        console.log(data);
        
        this.validateACState();
        clearInterval(this.interval);
        this.cd.detectChanges();
        this.interval = setInterval(() => {
          this.data.next({ action: 'connectLive' });
        }, 5000);
      }
    });
  }

  ngOnDestroy() {
    this.webSocketService.disconect();
    this.destroyed.next();
    this.destroyed.complete();
  }

  async changeACState(AC: number){
    switch (AC) {
      case 1: 
          {
            if(this.estado1 == true){
              this.IotData.CMD_OFF_AC1 = 1;
              this.IotData.CMD_ON_AC1 = 0;
            }

            if(this.estado1 == false){
              this.IotData.CMD_OFF_AC1 = 0;
              this.IotData.CMD_ON_AC1 = 1;
            }
          }
        break;
    
      case 2:
        {
          if(this.estado2 == true){
            this.IotData.CMD_OFF_AC2 = 1;
            this.IotData.CMD_ON_AC2 = 0;
          }

          if(this.estado2 == false){
            this.IotData.CMD_OFF_AC2 = 0;
            this.IotData.CMD_ON_AC2 = 1;
          };
          
        }
        break;

      default:
        break;
    }
    
    let response = await this.dataService.post(this.IotData).toPromise();
    console.log(response);
    
  }


  validateACState(){
    console.log(this.IotData);
    

    if(this.IotData.DISPARO_AC1 == 1){
      this.estado1 = false;
      this.colorAC1= "gray";
    }

    if(this.IotData.DISPARO_AC2 == 1){
      this.estado2 = false;
      this.colorAC2= "gray";
    }

    if(this.IotData.DISPARO_AC1 == 1 && this.IotData.AC1_ON == 1){
      this.estado1 = true;
      this.colorAC1= "#50D050";
    }

    if(this.IotData.DISPARO_AC2 == 1 && this.IotData.AC2_ON == 1){
      this.estado2 = true;
      this.colorAC2= "#50D050";
    }

    if(this.IotData.DISPARO_AC1 == 0 && this.IotData.AC1_ON == 0){
      this.estado1 = false;
      this.colorAC1= "gray";
    }

    if(this.IotData.DISPARO_AC2 == 0 && this.IotData.AC2_ON == 0){
      this.estado2 = false;
      this.colorAC2 = "gray";
    }
  }

  initIotData(){
  }

}
