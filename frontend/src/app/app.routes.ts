import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OfficerlayoutComponent } from './pages/officerlayout/officerlayout.component';
import { CustomerlayoutComponent } from './pages/customerlayout/customerlayout.component';
import { BookingServiceComponent } from './pages/customerpages/booking-service/booking-service.component';
import { ListParcelComponent } from './pages/customerpages/list-parcel/list-parcel.component';
import { ContactComponent } from './pages/customerpages/contact/contact.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OBookingServiceComponent } from './pages/officerpages/booking-service/booking-service.component';
import { OListParcelComponent } from './pages/officerpages/list-parcel/list-parcel.component';
import { ViewFeedbackComponent } from './pages/officerpages/view-feedback/view-feedback.component';


export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {
    path: 'officer',
    component: OfficerlayoutComponent,
      children: [
        { path: 'booking-service', component: OBookingServiceComponent },
        { path: 'list-parcel', component: OListParcelComponent },
        { path: 'payment/:bookingId', component: PaymentComponent },
        { path: 'feedback', component: ViewFeedbackComponent },
        { path: '', redirectTo: 'booking-service', pathMatch: 'full' }
      ]
    },
    {
    path: 'customer',
    component: CustomerlayoutComponent,
      children: [
        { path: 'booking-service', component: BookingServiceComponent },
        { path: 'list-parcel', component: ListParcelComponent },
        { path: 'contact', component: ContactComponent },
        { path: 'payment/:bookingId', component: PaymentComponent },
        { path: '', redirectTo: 'booking-service', pathMatch: 'full' }
      ]
    }
];
