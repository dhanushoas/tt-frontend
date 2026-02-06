import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';
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
import { PackageDetailsComponent } from './packages/package-details/package-details.component';
import { FoodServiceComponent } from './services/food-service/food-service.component';
import { BusServiceComponent } from './services/bus-service/bus-service.component';
import { CustomerServiceComponent } from './services/customer-service/customer-service.component';

import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard], title: 'TN Tourism - Home' },
  { path: 'about-us', component: AboutUsComponent, canActivate: [authGuard], title: 'TN Tourism - About Us' },
  { path: 'signup', component: SignupComponent, title: 'TN Tourism - Sign Up' },
  { path: 'signin', component: SigninComponent, title: 'TN Tourism - Sign In' },
  { path: 'verify-email', component: VerifyEmailComponent, title: 'TN Tourism - Verify Email' },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [authGuard], title: 'TN Tourism - Admin Panel' },
  { path: 'admin-signin', component: AdminSigninComponent, title: 'TN Tourism - Admin Login' },
  { path: 'admin-signup', component: AdminSignupComponent, title: 'TN Tourism - Admin Registration' },
  { path: 'image-upload', component: ImageUploadComponent, canActivate: [authGuard], title: 'TN Tourism - Image Management' },
  { path: 'all-bookings', component: AllBookingsComponent, canActivate: [authGuard], title: 'TN Tourism - Manage Bookings' },
  { path: 'all-payments', component: AllPaymentsComponent, canActivate: [authGuard], title: 'TN Tourism - Manage Payments' },
  { path: 'images-by-location', component: ImagesByLocationComponent, canActivate: [authGuard], title: 'TN Tourism - Gallery' },
  { path: 'district', component: DistrictComponent, canActivate: [authGuard], title: 'TN Tourism - Places to Visit' },
  { path: 'contact-us', component: ContactUsComponent, canActivate: [authGuard], title: 'TN Tourism - Contact Us' },
  { path: 'view/:customId', component: ViewComponent, canActivate: [authGuard], title: 'TN Tourism - Payment Status' },
  { path: 'update/:customId', component: UpdateComponent, canActivate: [authGuard], title: 'TN Tourism - Update Booking' },
  { path: 'getall', component: GetallComponent, canActivate: [authGuard], title: 'TN Tourism - My Bookings' },
  { path: 'post', component: PostComponent, canActivate: [authGuard], title: 'TN Tourism - Plan Your Trip' },
  { path: 'booking-view', component: BookingViewComponent, canActivate: [authGuard], title: 'TN Tourism - My Cart' },
  { path: 'packages', component: PackageDetailsComponent, canActivate: [authGuard], title: 'TN Tourism - Tour Packages' },
  { path: 'food-service', component: FoodServiceComponent, canActivate: [authGuard], title: 'TN Tourism - Food Services' },
  { path: 'bus-service', component: BusServiceComponent, canActivate: [authGuard], title: 'TN Tourism - Transport Services' },
  { path: 'customer-service', component: CustomerServiceComponent, canActivate: [authGuard], title: 'TN Tourism - Support' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
