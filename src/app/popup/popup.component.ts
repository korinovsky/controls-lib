import {Component} from '@angular/core';
import {ToasterService} from '../../../projects/controls/src/lib/toaster/toaster.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  constructor(
    private toasterService: ToasterService
  ) {}

  showToast() {
    this.toasterService.show('Toaster message', Math.floor(Math.random() * 4) as any, 10);
  }
}
