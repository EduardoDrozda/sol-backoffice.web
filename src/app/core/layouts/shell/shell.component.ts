import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaStatusComponent } from '@core/components/pwa-status/pwa-status.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, PwaStatusComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

}
