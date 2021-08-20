import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-switch-location',
  templateUrl: './switch-location.page.html',
  styleUrls: ['./switch-location.page.scss'],
})
export class SwitchLocationPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  get locations() {
    return this.authService.userProfile.userLocations;
  }

  get currentLocation() {
    return this.authService.currentLocation;
  }

  switchLocation(location: string) {
    this.authService.currentLocation = location;
    this.router.navigateByUrl('/observation');
  }
}
