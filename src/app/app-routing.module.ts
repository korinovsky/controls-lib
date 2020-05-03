import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FieldsComponent} from './fields/fields.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FieldsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
