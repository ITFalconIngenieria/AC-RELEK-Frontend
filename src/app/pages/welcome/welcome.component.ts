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
    AC1_ON: false,
    AC2_ON: false,
    CMD_OFF_AC1: false,
    CMD_OFF_AC2: false,
    CMD_ON_AC1: false,
    CMD_ON_AC2: false,
    DISPARO_AC1: false,
    DISPARO_AC2: false
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
              this.IotData.CMD_OFF_AC1 = true;
              this.IotData.CMD_ON_AC1 = false;
            }

            if(this.estado1 == false){
              this.IotData.CMD_OFF_AC1 = true;
              this.IotData.CMD_ON_AC1 = false;
            }
          }
        break;
    
      case 2:
        {
          if(this.estado2 == true){
            this.IotData.CMD_OFF_AC2 = true;
            this.IotData.CMD_ON_AC2 = false;
          }

          if(this.estado2 == false){
            this.IotData.CMD_OFF_AC2 = false;
            this.IotData.CMD_ON_AC2 = true;
          };
          
        }
        break;

      default:
        break;
    }
    
    let response = await this.dataService.post(this.IotData).toPromise();
  }


  validateACState(){
    console.log(this.IotData);
    

    if(this.IotData.DISPARO_AC1 == true){
      this.estado1 = false;
      this.colorAC1= "gray";
    }

    if(this.IotData.DISPARO_AC2 == true){
      this.estado2 = false;
      this.colorAC2= "gray";
    }

    if(this.IotData.DISPARO_AC1 == true && this.IotData.AC1_ON == true){
      this.estado1 = true;
      this.colorAC1= "#50D050";
    }

    if(this.IotData.DISPARO_AC2 == true && this.IotData.AC2_ON == true){
      this.estado2 = true;
      this.colorAC2= "#50D050";
    }

    if(this.IotData.DISPARO_AC1 == false && this.IotData.AC1_ON == false){
      this.estado1 = false;
      this.colorAC1= "gray";
    }

    if(this.IotData.DISPARO_AC2 == false && this.IotData.AC2_ON == false){
      this.estado2 = false;
      this.colorAC2 = "gray";
    }
  }

  initIotData(){
  }

}
