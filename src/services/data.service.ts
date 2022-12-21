import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { IOTData } from '../app/models/IOTData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  url = environment.apiURL;

  body = {
    "state": {
      "desired": {
        "CMD_ON_AC1": false,
        "CMD_ON_AC2": false,
        "DISPARO_AC1": false,
        "DISPARO_AC2": false,
        "CMD_OFF_AC2": false,
        "CMD_OFF_AC1": false,
        "AC1_ON": false,
        "AC2_ON": false
      }
    }
  }

  constructor(private http: HttpClient) {}

  get(){
    return this.http.get(this.url+"/data")
  }
  
  post(IotData: IOTData){
    this.body.state.desired.AC1_ON = IotData.AC1_ON;
    this.body.state.desired.AC2_ON = IotData.AC2_ON;
    this.body.state.desired.CMD_OFF_AC1 = IotData.CMD_OFF_AC1;
    this.body.state.desired.CMD_OFF_AC2 = IotData.CMD_OFF_AC2;
    this.body.state.desired.CMD_ON_AC1 = IotData.CMD_ON_AC1;
    this.body.state.desired.CMD_ON_AC2 = IotData.CMD_ON_AC2;
    this.body.state.desired.DISPARO_AC1 = IotData.DISPARO_AC1;
    this.body.state.desired.DISPARO_AC2 = IotData.DISPARO_AC2;
    console.log(this.body);
    
    return this.http.post(this.url+"/data",this.body);
  }

}