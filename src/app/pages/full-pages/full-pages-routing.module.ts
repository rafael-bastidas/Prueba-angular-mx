import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: '',
        component: UsersListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'detalle/:id',
        component: UsersEditComponent,
        data: {
          title: 'Edit'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPagesRoutingModule { }
