import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsResolver } from './core/resolvers/boards.resolver';

import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    resolve: { boards: BoardsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
