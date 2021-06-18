import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'cy-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `cy-auth-container`
  }
})
export class AuthContainerComponent {

}
