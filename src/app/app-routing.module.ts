import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FieldsComponent} from './fields/fields.component';
import {PopupComponent} from './popup/popup.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FieldsComponent
  },
  {
    path: 'popup',
    component: PopupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
