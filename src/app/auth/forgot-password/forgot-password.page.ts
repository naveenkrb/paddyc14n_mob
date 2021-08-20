import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/common/app-config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  forgotPassword() {
    this.authService.logout();
  }

  get orgName() {
    return AppConfig.orgName.valueOf();
  }

  get appName() {
    return AppConfig.appName.valueOf();
  }

}
