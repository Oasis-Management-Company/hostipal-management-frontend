import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '../hospital/management/settings/settings';
import { SettingsService } from '../hospital/management/settings/settings.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  hospitals: Settings[];

  constructor(private settingsService: SettingsService, private router: Router) { }

  getHospitals() {
    this.settingsService.allHospitals().subscribe(data => {
      this.hospitals = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title", "Home")
    if(String(localStorage.getItem("title")) != "Home"){
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.getHospitals();
  }

  scroll(element: HTMLElement) {
    element.scrollIntoView();
  }

}
