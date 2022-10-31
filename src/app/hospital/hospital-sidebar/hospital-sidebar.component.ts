import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../management/settings/settings.service';

@Component({
  selector: 'app-hospital-sidebar',
  templateUrl: './hospital-sidebar.component.html',
  styleUrls: ['./hospital-sidebar.component.css']
})
export class HospitalSidebarComponent implements OnInit {
  staffID: string;
  hospitalID: number;
  id = String(this.route.snapshot.paramMap.get('id'));
  image: any;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.staffID = String(localStorage.getItem("staffID"));
    if ((this.id == this.staffID) && (this.staffID != "null")) {
      this.hospitalID = Number(localStorage.getItem("hospitalID"));
      this.getImage();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  goToManagement() {
    if (localStorage.getItem("admin") == "true") {
      this.router.navigate(['hospital/management', this.hospitalID]);
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['hospital/staff/login']);
  }

  getImage() {
    this.image = null;
    this.settingsService.getImage(this.hospitalID).subscribe(data => {
      this.image = data;
      this.image = 'data:image/jpeg;base64,' + this.image.logo;
    }, error => {
      this.image == null;
    })
  }
}
