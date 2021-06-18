import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import mapboxgl from 'mapbox-gl'
import { Competition } from '../../../../domain'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent implements OnInit {

  public map: mapboxgl.Map | null = null

  @Input()
  public competition: Competition | null = null

  public ngOnInit(): void {
  }
}
