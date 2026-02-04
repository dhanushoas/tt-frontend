import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ViewComponent } from './book-now/payment/view.component';
import { UpdateComponent } from './book-now/update/update.component';
import { GetallComponent } from './book-now/getall/getall.component';
import { PostComponent } from './book-now/post/post.component';
import { BookService } from './book-now/book.service';
import { SignupComponent } from './user/signup/signup.component';
import { SigninComponent } from './user/signin/signin.component';
import { UserService } from './user/user.service';
import { HomeComponent } from './home/home.component';
import { DistrictComponent } from './tamilnadu/district/district.component';
import { BookingViewComponent } from './book-now/booking-view/booking-view.component';
import { AdminSigninComponent } from './admin/admin-signin/admin-signin.component';
import { AdminSignupComponent } from './admin/admin-signup/admin-signup.component';
import { AdminService } from './admin/admin.service';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImageUploadComponent } from './admin/admin-dashboard/image-upload/image-upload.component';
import { ImagesByLocationComponent } from './admin/admin-dashboard/images-by-location/images-by-location.component';
import { AllBookingsComponent } from './admin/admin-dashboard/all-bookings/all-bookings.component';
import { AllPaymentsComponent } from './admin/admin-dashboard/all-payments/all-payments.component';
import { ImageService } from './admin/admin-dashboard/image-upload/image.service';
import { FollowUsComponent } from './follow-us/follow-us.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AuthInterceptor } from './auth.interceptor';

import { SecureImagePipe } from './secure-image.pipe';
import { ToastComponent } from './toast/toast.component';

import { VerifyEmailComponent } from './user/verify-email/verify-email.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    SignupComponent,
    SigninComponent,
    ContactUsComponent,
    ViewComponent,
    UpdateComponent,
    GetallComponent,
    PostComponent,
    HomeComponent,
    DistrictComponent,
    BookingViewComponent,
    AdminSigninComponent,
    AdminSignupComponent,
    AdminHomeComponent,
    ImageUploadComponent,
    NavbarComponent,
    DashboardComponent,
    ImagesByLocationComponent,
    AllBookingsComponent,
    AllPaymentsComponent,
    FollowUsComponent,
    SecureImagePipe,
    ToastComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    UserService,
    BookService,
    AdminService,
    ImageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
