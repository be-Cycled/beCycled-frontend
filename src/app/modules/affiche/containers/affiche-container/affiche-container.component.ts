import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: ['./affiche-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent implements OnInit {

  public ngOnInit(): void {
  }

}
