/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { ServiceUrl } from '../common/service-url';
import { StorageKeys } from '../common/storage-keys';
import { CropPlan } from '../data/crop-plan';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { SeasonService } from './season.service';
import { ServiceBase } from './service-base';
import { ServiceResponse } from '../data/service-response';
import { catchError, tap } from 'rxjs/operators';
import { FieldError } from '../common/field-error';
import { HttpProvider } from '../common/http-provider';

export interface PlanData {
  planId?: number;
  location: string;
  seasonCode: string;
  cropId: number[];
  wipId?: string;
}

interface PlanResponseData {
  planId?: number;
  errors?: FieldError[];
  wipId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService extends ServiceBase {
  private _plans: CropPlan[];
  private _currentPlan: CropPlan;

  constructor(
    private seasonService: SeasonService,
    private authService: AuthService,
    private http: HttpProvider,
    private storageService: StorageService) {
    super();
    this._plans = [];
  }

  initializeData(data: PlanData[] = null) {
    if (data != null) {
      this._plans = [];
      data.forEach(d => this._plans.push(this.getPlanFromData(d)));
      this.storePlans();
    } else {
      const cached = this.storageService.get(StorageKeys.plans);
      if (cached) {
        this._plans = cached;
      } else {
        console.log('No plans in cache');
      }
    }
  }

  get activeSeasons() {
    return this.seasonService.findBySeasonCodes(
      this._plans
        .filter(k => k.location === this.authService.currentLocation)
        .map(k => k.season.seasonCode));
  }

  saveCurrentPlan() {
    //console.log(this._currentPlan);
    const index = this._plans.findIndex(
      plan => (
        plan.location === this._currentPlan.location &&
        plan.season.seasonCode === this._currentPlan.season.seasonCode));

    if (index !== -1) {
      this._plans[index] = this._currentPlan;
    } else {
      this._plans.push(this._currentPlan);
    }

    //console.log(this._plans);
    return this.savePlans();
  }

  set currentPlan(plan: CropPlan) {
    this._currentPlan = plan;
    //console.log(this._currentPlan);
  }

  get currentPlan() {
    return this._currentPlan;
  }

  findPlansByLocation(location: string, withPlanId = true) {
    return this._plans.filter((k) => {
      let matched = k.location === location;
      if (matched && withPlanId) {
        matched = matched && k.planId && k.planId > 0;
      }
      return matched;
    });
  }

  findPlanById(id: number) {
    return this._plans.find(k => k.planId === id);
  }

  findPlanByLocationAndSeason(location: string, seasonCode: string, withPlanId = true) {
    return this._plans
      .find((k) => {
        let matched = k.location === location &&
          k.season.seasonCode === seasonCode;
        if (matched && withPlanId) {
          matched = matched && k.planId && k.planId > 0;
        }
        return matched;
      });
  }

  storePlans() {
    this.storageService.set(StorageKeys.plans, this._plans);
  }

  synchronizePlanData() {
    return this.http
      .get<PlanData[]>(this.getServiceUrl(ServiceUrl.planData))
      .pipe(
        tap(
          data => this.initializeData(data),
          error => {
            this.initializeData();
            throw error;
          }
        )
      );
  }

  private getPlanFromData(data: PlanData) {
    const plan = new CropPlan(data.location, this.seasonService.find(data.seasonCode), +data.planId);
    // This is Important, to cast the input cropIds from string to number
    plan.crops = data.cropId.map(v => +v);
    return plan;
  }

  private getDataFromPlan(plan: CropPlan): PlanData {
    return {
      planId: plan.planId,
      location: plan.location,
      seasonCode: plan.season.seasonCode,
      cropId: plan.crops,
      wipId: plan.wipId
    };
  }

  private savePlans() {
    const plansToSave = this._plans
      .filter(p => p.isDirty)
      .map<PlanData>(p => this.getDataFromPlan(p));

    return this.http
      .post<ServiceResponse<PlanResponseData[]>>(this.getServiceUrl(ServiceUrl.savePlan),
        plansToSave)
      .pipe(
        catchError(error => {
          throw error;
        }),
        tap(response => {
          if (this.hasNoError(response)) {
            response.appData.forEach(p => {
              if (p.errors && p.errors.length > 0) {
                console.log(p.wipId + ', ' + p.errors);
              } else {
                const index = this._plans.
                  findIndex(_p => _p.wipId === p.wipId);
                if (index !== -1) {
                  this._plans[index].planId = +p.planId;
                  this._plans[index].resetIsDirty();
                } else {
                  console.log('Invalid plan ,' + p.wipId);
                }
              }
            });
            this.storePlans();
          }
        })
      );
  }
}
