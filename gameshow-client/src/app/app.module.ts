import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from '@angular/cdk/clipboard'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { GameComponent } from './components/game/game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HostComponent } from './components/host/host.component';
import { DndDirective } from './dnd.directive';


const config: SocketIoConfig = { url: 'https://gameshow.flayinahook.de/', options: {}, };

@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    GameComponent,
    HostComponent,
    DndDirective
  ],
  imports: [
    BrowserModule,
    ClipboardModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
