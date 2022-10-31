import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/hospital/management/settings/settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  id: string;
  image: any;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.id = String(localStorage.getItem("patientID"));
    if (this.id == null) {
      this.router.navigate(['authentication']);
    } else {
      this.getImage();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

  getImage() {
    this.image = null;
    this.settingsService.getImage(Number(localStorage.getItem("hospitalID"))).subscribe(data => {
      this.image = data;
      this.image = 'data:image/jpeg;base64,' + this.image.logo;
    }, error => {
      this.image == null;
    })
  }

}