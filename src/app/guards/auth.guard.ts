import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AutenticaService } from '../servicios/autentica.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private auth!: AutenticaService
  private router = inject(Router)
  private autenticaServicio= inject(AutenticaService)

  canActivate(): boolean {
    const token = this.autenticaServicio.tokenActual() 

    if (!token || token === '') {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return true;
  }
  
}
