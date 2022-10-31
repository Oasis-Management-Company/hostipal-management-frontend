import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Logs } from '../logs';
import { LogsService } from '../logs.service';

@Component({
  selector: 'app-payment-logs',
  templateUrl: './payment-logs.component.html',
  styleUrls: ['./payment-logs.component.css']
})
export class PaymentLogsComponent implements OnInit {
  logs: Logs[];
  id: number;

  constructor(private router: Router, private route: ActivatedRoute, private logsService: LogsService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Logs - Payment")         
    if (String(localStorage.getItem("title")) != "Logs - Payment") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.id = Number(localStorage.getItem("hospitalID"));
    if (this.id && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.logsService.logs(this.id, "payment").subscribe(data => {
        this.logs = data; 
        for (let i = 0; i < this.logs.length; i++) {
          let log = new Logs();
          log = this.logs[i];
          let date: string[];
          date = log.date.split("T");
          log.date = date[0] +" "+ date[1].split(".")[0];
        }
      })
    } else {
      this.router.navigate(['hospital']);
    }
  }
}
