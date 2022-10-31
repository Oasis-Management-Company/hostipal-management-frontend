import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './dashboard/appointment/appointment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HospitalSidebarComponent } from './hospital/hospital-sidebar/hospital-sidebar.component';
import { RecordComponent } from './dashboard/record/record.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { HospitalComponent } from './hospital/hospital.component';
import { PatientComponent } from './hospital/patient/patient.component';
import { HospitalAppointmentComponent } from './hospital/hospital-appointment/hospital-appointment.component';
import { AuthenticationComponent } from './dashboard/authentication/authentication.component';
import { AddPatientComponent } from './hospital/patient/add-patient/add-patient.component';
import { PostPatientComponent } from './hospital/patient/post-patient/post-patient.component';
import { ListPatientComponent } from './hospital/patient/list-patient/list-patient.component';
import { DoctorComponent } from './hospital/doctor/doctor.component';
import { PatientRecordComponent } from './hospital/doctor/patient-record/patient-record.component';
import { SetupComponent } from './hospital/management/settings/setup.component';
import { ManagementComponent } from './hospital/management/management.component';
import { PharmacyComponent } from './hospital/pharmacy/pharmacy.component';
import { PaymentLogsComponent } from './hospital/management/logs/payment-logs/payment-logs.component';
import { PatientManageComponent } from './hospital/management/patient-manage/patient-manage.component';
import { AppointmentManageComponent } from './hospital/management/appointment-manage/appointment-manage.component';
import { AppointmentLogsComponent } from './hospital/management/logs/appointment-logs/appointment-logs.component';
import { StaffComponent } from './hospital/management/staff/staff.component';
import { MedStaffComponent } from './hospital/management/staff/med-staff/med-staff.component';
import { NonMedComponent } from './hospital/management/staff/non-med/non-med.component';
import { SystemComponent } from './hospital/management/settings/system/system.component';
import { LandingComponent } from './landing/landing.component';
import { MedLabComponent } from './hospital/med-lab/med-lab.component';
import { PaymentManageComponent } from './hospital/management/drugs-manage/payment-manage/payment-manage.component';
import { DrugsManageComponent } from './hospital/management/drugs-manage/drugs-manage.component';
import { EmailComponent } from './email/email.component';
import { WaitingListComponent } from './hospital/management/waiting-list/waiting-list.component';
import { DispenseLogsComponent } from './hospital/management/logs/dispense-logs/dispense-logs.component';
import { LogsComponent } from './hospital/management/logs/logs.component';
import { ChangePassComponent } from './change-pass/change-pass.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: LandingComponent },
  { path: 'changePassword/patient/:id/:hospitalID', component: ChangePassComponent },
  { path: 'changePassword/hospital/:hospitalID', component: ChangePassComponent },
  { path: 'changePassword/staff/:id/:hospitalID', component: ChangePassComponent },
  { path: 'confirm/patient/:id/:hospitalID', component: EmailComponent },
  { path: 'confirm/staff/:staffID/:hospitalID', component: EmailComponent },
  { path: 'confirm/hospital/:hospitalID', component: EmailComponent },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'sidebar', component: SidebarComponent },
  {
    path: 'appointment', children: [
      { path: ':id', component: AppointmentComponent }
    ]
  },
  { path: 'record/:id', component: RecordComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'hospital-sidebar', component: HospitalSidebarComponent },
  {
    path: 'hospital', children: [
      { path: '', pathMatch: 'full', redirectTo: 'setup' },
      { path: 'setup', component: SetupComponent },
      {
        path: 'management', children: [
          { path: ':id', component: ManagementComponent },
          { path: 'patients/:id', component: PatientManageComponent },
          { path: 'appointments/:id', component: AppointmentManageComponent },
          { path: 'visits/:id', component: WaitingListComponent },
          {
            path: 'logs', children: [
              { path: ':id', component: LogsComponent },
              { path: 'dispense/:id', component: DispenseLogsComponent },
              { path: 'payment/:id', component: PaymentLogsComponent },
              { path: 'appointment/:id', component: AppointmentLogsComponent }
            ]
          },
          {
            path: 'staff', children: [
              { path: ':id', component: StaffComponent },
              { path: 'medical/:id', component: MedStaffComponent },
              { path: 'nonmed/:id', component: NonMedComponent }
            ]
          },
          // {path:'settings'}
          {
            path: 'pharmacy', children: [
              { path: ':id', component: DrugsManageComponent },
              { path: 'payment/:id', component: PaymentManageComponent }
            ]
          },
          { path: 'settings/:id', component: SystemComponent }
        ]
      },
      { path: 'staff/login', component: HospitalComponent },
      { path: 'dashboard/:id', component: PatientComponent },
      {
        path: 'doctor', children: [
          { path: ':id', component: DoctorComponent },
          { path: 'record/:id', component: PatientRecordComponent }
        ]
      },
      {
        path: 'patient', children: [
          { path: 'add/:id', component: AddPatientComponent },
          { path: 'post/:id', component: PostPatientComponent },
          { path: 'waiting/:id', component: ListPatientComponent }
        ]
      },
      { path: 'appointments/:id', component: HospitalAppointmentComponent },

      {
        path: 'services', children: [
          { path: 'pharmacy/:id', component: PharmacyComponent },
          { path: 'lab/:id', component: MedLabComponent }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }