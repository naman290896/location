import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";  
declare var google: any;
@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  constructor(private httpService:HttpClient, private spinner: NgxSpinnerService) { }
  hidden = true
  location:any = [];
  states:any = [];
  cities = [];
  latitude:number = 23.0225;
  longitude:number = 72.5714;
  geocoder = new google.maps.Geocoder();
  changeState(event){
    this.cities = [];
    let selectedState = event.target.value;
    this.location.forEach((item) =>{
      if(item.State == selectedState){
        this.cities.push(item.City);
      }
    });
  }
  updateLatLng(address, callback){
    var lat,lng;
    this.geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        callback(lat, lng);
      }
    });
  }
  changeCity(event){
    this.hidden = false;
    var address = event.target.value;
    this.updateLatLng(address, (lat, lng)=>{   
      this.latitude = lat;
      this.longitude = lng;
    })
    this.detectDivChanges();
  }
  detectDivChanges() {
    const div = document.querySelector('agm-map');
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutation) => {
      this.hidden = true;
      console.log('changed');
    })
    observer.observe(div, config);
  }
  ngOnInit(){
    this.httpService.get('https://indian-cities-api-nocbegfhqg.now.sh/cities').subscribe((data) => {
      this.location = data as string;
      this.location.forEach((item) => {
        if (this.states.findIndex(i => i.State == item.State) == -1) {
          this.states.push(item);
        }
      });
    })
  }
}
