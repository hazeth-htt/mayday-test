import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-dev-tools',
  standalone: true,
  template: '',
})
export class LoginDevToolsComponent {
  @Output() fillCredentials = new EventEmitter<{ phone: string; pass: string }>();
}
