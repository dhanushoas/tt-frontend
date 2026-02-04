import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ViewComponent } from './book-now/payment/view.component';
import { UpdateComponent } from './book-now/update/update.component';
import { GetallComponent } from './book-now/getall/getall.component';
import { PostComponent } from './book-now/post/post.component';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { DistrictComponent } from './tamilnadu/district/district.component';
import { BookingViewComponent } from './book-now/booking-view/booking-view.component';
import { AdminSigninComponent } from './admin/admin-signin/admin-signin.component';
import { AdminSignupComponent } from './admin/admin-signup/admin-signup.component';
import { ImageUploadComponent } from './admin/admin-dashboard/image-upload/image-upload.component';
import { AllBookingsComponent } from './admin/admin-dashboard/all-bookings/all-bookings.component';
import { AllPaymentsComponent } from './admin/admin-dashboard/all-payments/all-payments.component';
import { ImagesByLocationComponent } from './admin/admin-dashboard/images-by-location/images-by-location.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';

import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home, which is guarded
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about-us', component: AboutUsComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [authGuard] },
  { path: 'admin-signin', component: AdminSigninComponent },
  { path: 'admin-signup', component: AdminSignupComponent },
  { path: 'image-upload', component: ImageUploadComponent, canActivate: [authGuard] },
  { path: 'all-bookings', component: AllBookingsComponent, canActivate: [authGuard] },
  { path: 'all-payments', component: AllPaymentsComponent, canActivate: [authGuard] },
  { path: 'images-by-location', component: ImagesByLocationComponent, canActivate: [authGuard] },
  { path: 'district', component: DistrictComponent, canActivate: [authGuard] },
  { path: 'contact-us', component: ContactUsComponent, canActivate: [authGuard] },
  { path: 'view/:customId', component: ViewComponent, canActivate: [authGuard] },
  { path: 'update/:customId', component: UpdateComponent, canActivate: [authGuard] },
  { path: 'getall', component: GetallComponent, canActivate: [authGuard] },
  { path: 'post', component: PostComponent, canActivate: [authGuard] },
  { path: 'booking-view', component: BookingViewComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
