export class Appointment {
    id: number;
    hospitalID: number;
    patientID: string;
    patientName: string;
    doctorName: string;
    complaint: string;
    specialist: string;
    date: Date;
    time: string;
    status: number;
}