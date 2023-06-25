import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleFormPageRoutingModule } from './schedule-form-routing.module';

import { ScheduleFormPage } from './schedule-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleFormPageRoutingModule
  ],
  declarations: [ScheduleFormPage]
})
export class ScheduleFormPageModule {}
