import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-single-community-container',
  templateUrl: './single-community-container.component.html',
  styleUrls: ['./single-community-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCommunityContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
