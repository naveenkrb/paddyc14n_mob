import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppConfig } from './common/app-config';
import { ResultCode } from './common/result-code';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  get userId() {
    if (this.authService.isLoggedIn) {
      return this.authService.userProfile.userId;
    }
  }

  get currentLocation() {
    if (this.authService.isLoggedIn) {
      return this.authService.currentLocation;
    }
  }

  get appVersion() {
    return AppConfig.appVersion.valueOf();
  }

  get orgName() {
    return AppConfig.orgName.valueOf();
  }

  logout() {
    if (!this.authService.isLoggedIn) {
      console.log('Already logged out');
      return;
    } else {
      this.loadingController.create({
        keyboardClose: true,
        message: 'Signing out ...',
        //spinner: 'dots',
      }).then(le => {
        le.present().then(() => {
          le.dismiss();
          this.authService.logout().subscribe(
            response => {
              if (response.appResult.resultCode === ResultCode.noError) {
                this.router.navigateByUrl('/auth');
              } else {
                this.showAlert(response.appResult.resultMessage);
              }
            },
            error => {
              le.dismiss();
              console.error(error);
              if ((error as HttpErrorResponse).status === 403) {
                this.router.navigateByUrl('/auth');
              }
              this.showAlert('Technical error');
            }
          );
        });
      });
    }
  }

  showAlert(_message: string) {
    this.alertController.create({
      header: 'Logout failed',
      message: _message,
      buttons: ['Ok'],
      keyboardClose: true,
    }).then(ae => ae.present());
  }
}
