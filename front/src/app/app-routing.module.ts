import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanPokerComponent } from './plan-poker/plan-poker.component';

const routes: Routes = [
  { path: ':id', component: PlanPokerComponent},
  { path: '**', component: PlanPokerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
