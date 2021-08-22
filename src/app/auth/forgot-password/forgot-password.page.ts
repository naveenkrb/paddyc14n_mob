import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppConfig } from 'src/app/common/app-config';
import { ResultCode } from 'src/app/common/result-code';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  forgotPassword(f: NgForm) {
    if (f.invalid) {
      return;
    }

    if (f.valid) {
      this.loadingController.create({
        keyboardClose: true,
        message: 'Initiating forgot password...',
        //spinner: 'dots',
      }).then(le => {
        le.present().then(() => {
          this.authService.forgotPassword(f.value.user).subscribe(
            response => {
              le.dismiss();
              if (response.appResult.resultCode === ResultCode.noError) {
                f.reset();
                this.router.navigateByUrl('/auth');
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

  get orgName() {
    return AppConfig.orgName.valueOf();
  }

  get appName() {
    return AppConfig.appName.valueOf();
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Forgot password failed',
      message: _message,
      buttons: ['Ok'],
      keyboardClose: true,
    }).then(ae => ae.present());
  }
}
