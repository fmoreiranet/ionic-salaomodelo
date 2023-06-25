import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleFormPage } from './schedule-form.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleFormPageRoutingModule {}
