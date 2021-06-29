import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-review',
  templateUrl: './community-review.component.html',
  styleUrls: ['./community-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityReviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
