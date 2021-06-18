import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: ['./feed-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
