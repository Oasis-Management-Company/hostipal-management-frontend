import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-management-sidebar',
  templateUrl: './management-sidebar.component.html',
  styleUrls: ['./management-sidebar.component.css']
})
export class ManagementSidebarComponent implements OnInit {
  hospitalID: number;
  id = Number(this.route.snapshot.paramMap.get("id"));
  image: any;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID == this.id && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.getImage();
    } else {
      this.router.navigate(['hospital']);
    }
  }

  getImage() {
    this.settingsService.getImage(this.id).subscribe(data => {
      this.image = data;
      this.image = 'data:image/jpeg;base64,' + this.image.logo;
    }, error => {
      this.image == null;
    })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['hospital']);
  }



}
