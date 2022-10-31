import { Component, OnInit } from '@angular/core';
import { LogsService } from './logs.service';
import { Logs } from './logs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: Logs[];
  id: number;

  constructor(private router: Router, private route: ActivatedRoute, private logsService: LogsService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Hospital Logs")           
    if (String(localStorage.getItem("title")) != "Hospital Logs") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.id = Number(localStorage.getItem("hospitalID"));
    if (this.id && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.logsService.allLogs(this.id).subscribe(data => {
        this.logs = data;
        for (let i = 0; i < this.logs.length; i++) {
          let log = new Logs();
          log = this.logs[i];
          let date: string[];
          date = log.date.split("T");
          log.date = date[0] +" "+ date[1].split(".")[0];
          console.log(log);
        }
      })
    } else {
      this.router.navigate(['hospital'])
    }
  }

}
