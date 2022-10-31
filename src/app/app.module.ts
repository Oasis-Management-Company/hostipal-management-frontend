import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { AppointmentComponent } from './dashboard/appointment/appointment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordComponent } from './dashboard/record/record.component';
import { PatientComponent } from './hospital/patient/patient.component';
import { HospitalComponent } from './hospital/hospital.component';
import { HospitalSidebarComponent } from './hospital/hospital-sidebar/hospital-sidebar.component';
import { AddPatientComponent } from './hospital/patient/add-patient/add-patient.component';
import { PostPatientComponent } from './hospital/patient/post-patient/post-patient.component';
import { DoctorComponent } from './hospital/doctor/doctor.component';
import { HospitalAppointmentComponent } from './hospital/hospital-appointment/hospital-appointment.component';
import { PatientRecordComponent } from './hospital/doctor/patient-record/patient-record.component';
import { AuthenticationComponent } from './dashboard/authentication/authentication.component';
import { PharmacyComponent } from './hospital/pharmacy/pharmacy.component';
import { MedLabComponent } from './hospital/med-lab/med-lab.component';
import { ListPatientComponent } from './hospital/patient/list-patient/list-patient.component';
import { SetupComponent } from './hospital/management/settings/setup.component';
import { ManagementComponent } from './hospital/management/management.component';
import { PatientManageComponent } from './hospital/management/patient-manage/patient-manage.component';
import { ManagementSidebarComponent } from './hospital/management/management-sidebar/management-sidebar.component';
import { AppointmentManageComponent } from './hospital/management/appointment-manage/appointment-manage.component';
import { DispenseLogsComponent } from './hospital/management/logs/dispense-logs/dispense-logs.component';
import { PaymentLogsComponent } from './hospital/management/logs/payment-logs/payment-logs.component';
import { LogsComponent } from './hospital/management/logs/logs.component';
import { AppointmentLogsComponent } from './hospital/management/logs/appointment-logs/appointment-logs.component';
import { SystemComponent } from './hospital/management/settings/system/system.component';
import { MedStaffComponent } from './hospital/management/staff/med-staff/med-staff.component';
import { NonMedComponent } from './hospital/management/staff/non-med/non-med.component';
import { StaffComponent } from './hospital/management/staff/staff.component';
import { LandingComponent } from './landing/landing.component';
import { DrugsManageComponent } from './hospital/management/drugs-manage/drugs-manage.component';
import { PaymentManageComponent } from './hospital/management/drugs-manage/payment-manage/payment-manage.component';
import { EmailComponent } from './email/email.component';
import { WaitingListComponent } from './hospital/management/waiting-list/waiting-list.component';
import { ChangePassComponent } from './change-pass/change-pass.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HospitalSidebarComponent,
    AppointmentComponent,
    DashboardComponent,
    RecordComponent,
    PatientComponent,
    PatientManageComponent,
    LogsComponent,
    DispenseLogsComponent,
    PaymentLogsComponent,
    SystemComponent,
    StaffComponent,
    HospitalComponent,
    AddPatientComponent,
    PostPatientComponent,
    DoctorComponent,
    HospitalAppointmentComponent,
    PatientRecordComponent,
    AuthenticationComponent,
    PharmacyComponent,
    MedLabComponent,
    ListPatientComponent,
    SetupComponent,
    ManagementComponent,
    ManagementSidebarComponent,
    AppointmentManageComponent,
    AppointmentLogsComponent,
    MedStaffComponent,
    NonMedComponent,
    LandingComponent,
    DrugsManageComponent,
    PaymentManageComponent,
    EmailComponent,
    WaitingListComponent,
    ChangePassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
    PdfViewerModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }