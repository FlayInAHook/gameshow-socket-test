import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuzzGameComponent } from './components/game/buzz/buzzgame.component';
import { BuzzHostComponent } from './components/host/buzz/buzzhost.component';
import { SortHostComponent } from './components/host/sort/sorthost.component';
import { CreateGameComponent } from './create-game/create-game.component';

const routes: Routes = [
    {
      path: 'create',
      component: CreateGameComponent
    },
    {
      path: 'host',
      children: [
        {
          path: "buzz/:id",
          component: BuzzHostComponent
        },
        {
          path: "sort/:id",
          component: SortHostComponent
        }
      ]
    },
    {
      path: 'join',
      children: [
        {
          path: "buzz/:id",
          component: BuzzGameComponent
        },
        {
          path: "sort/:id",
          component: BuzzGameComponent
        }
      ]
    },
    {
      path: 'record',
      children: [
        {
          path: "sort/:id",
          component: BuzzHostComponent
        }
      ]
    },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
