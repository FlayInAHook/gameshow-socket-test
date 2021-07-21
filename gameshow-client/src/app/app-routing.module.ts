import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HostComponent } from './components/host/host.component';

const routes: Routes = [  
    {
      path: 'join/:id',
      component: GameComponent
    }, 
    {
      path: 'host/:id',
      component: HostComponent
    },
    {
      path: 'host',
      component: HostComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
