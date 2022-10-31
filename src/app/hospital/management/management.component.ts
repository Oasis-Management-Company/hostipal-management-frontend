import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings/settings.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/dashboard/patient';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { Logs } from './logs/logs';
import { LogsService } from './logs/logs.service';
import { Record } from 'src/app/dashboard/record/record';
import { Staff } from '../staff';
import { Visit } from '../patient/visit';

declare const Chart: any;

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  date: any;
  patients: Patient[];
  logs: Logs[];
  appointments: Appointment[];
  records: Record[];
  visits: Visit[];
  doctors: Staff[];
  staffs: Staff[];
  availableStaffs: Staff[];
  array = new Array();
  hospitalID: number;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private logsService: LogsService) { }

  countPatients() {
    this.settingsService.allPatients(this.hospitalID).subscribe(data => {
      this.patients = data;
    });
  }

  countAppointments() {
    this.settingsService.todayAppointment(this.hospitalID).subscribe(data => {
      this.appointments = data;
    });
  }

  countVisits() {
    this.settingsService.todayVisit(this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  countDoctors() {
    this.settingsService.allDoctors(this.hospitalID).subscribe(data => {
      this.doctors = data;
      this.array.push(this.appointments.length, this.visits.length, this.availableStaffs.length);
    })
  }

  countStaff() {
    this.settingsService.allStaff(this.hospitalID).subscribe(data => {
      this.staffs = data;
      this.loadChart(this.array[0], this.array[1], this.array[2]);
    })
  }

  availableStaff() {
    this.settingsService.availableStaff(this.hospitalID).subscribe(data => {
      this.availableStaffs = data;
    })
  }

  loadLogs() {
    this.logsService.allLogs(this.hospitalID).subscribe(data => {
      this.logs = data;
      for (let i = 0; i < this.logs.length; i++) {
        let log = new Logs();
        log = this.logs[i];
        let date: string[];
        date = log.date.split("T");
        log.date = date[0] +" "+ date[1].split(".")[0];
      }
    })
  }

  todaysDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  loadChart(a: number, b: number, c: number) {
    const data = {
      labels: [
        'Appointments',
        'Walk-Ins',
        'Available Staff'
      ],
      datasets: [{
        label: 'Statistics of the Day',
        data: [a, b, c],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    new Chart("pieChart", {
      type: 'pie',
      data: data,
    });
  }

  ngOnInit(): void {
    localStorage.setItem("title","Admin Dashboard")  
    if (String(localStorage.getItem("title")) != "Admin Dashboard") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.array = [];
      this.todaysDate();
      this.loadLogs();
      this.countPatients();
      this.countAppointments();
      this.countVisits();
      this.availableStaff();
      this.countDoctors();
      this.countStaff();
    } else {
      this.router.navigate(['hospital']);
    }
  }

}