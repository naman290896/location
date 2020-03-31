import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { callbackify } from 'util';
declare var google: any;
@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {
  @ViewChild('googleMapAttr', {static: true}) googleMapAttr: ElementRef;
  @ViewChild('googleMapMarker', {static: true}) googleMapMarker: ElementRef;
  constructor(private httpService:HttpClient) { }
  location:any = [];
  states:any = [];
  cities = [];
  coords = [];
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
    var address = event.target.value;
    this.updateLatLng(address, (lat, lng)=>{
      console.log(lat, lng);
      this.latitude = lat;
      this.longitude = lng;
    })
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
