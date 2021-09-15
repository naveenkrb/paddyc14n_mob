/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../common/app-config';
import { ResultCode } from '../common/result-code';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  login(f: NgForm) {
    if (this.authService.isLoggedIn) {
      console.log('Alreay logged in');
      this.router.navigateByUrl('/observation');
      return;
    }

    if (f.invalid) {
      return;
    }

    if (f.valid) {
      this.loadingController.create({
        keyboardClose: true,
        message: 'Signing in ...',
        //spinner: 'dots',
      }).then(le => {
        le.present().then(() => {
          this.authService.login(f.value.user, f.value.password).subscribe(
            response => {
              le.dismiss();
              if (response.appResult.resultCode === ResultCode.noError) {
                f.reset();
                this.router.navigateByUrl('/observation/synchronize-data');
              } else {
                this.showAlert(response.appResult.resultMessage);
              }
            },
            error => {
              le.dismiss();
              console.error(error);
              this.showAlert('Technical error');
            });
        });
      });
    }
  }

  get appVersion() {
    return AppConfig.appVersion.valueOf() + (environment.production ? '' : 'd');
  }

  get orgName() {
    return AppConfig.orgName.valueOf();
  }

  get appName() {
    return AppConfig.appName.valueOf();
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Login failed',
      message: _message,
      buttons: ['Ok'],
      keyboardClose: true,
    }).then(ae => ae.present());
  }
}
