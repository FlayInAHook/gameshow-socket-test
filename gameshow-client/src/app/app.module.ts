import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from '@angular/cdk/clipboard'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuzzGameComponent } from './components/game/buzz/buzzgame.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BuzzHostComponent } from './components/host/buzz/buzzhost.component';
import { DndDirective } from './dnd.directive';
import { CreateGameComponent } from './create-game/create-game.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SortHostComponent } from './components/host/sort/sorthost.component';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { EditableComponent } from './components/editable/editable.component';


//const config: SocketIoConfig = { url: 'http://localhost:4444', options: {}, };
const config: SocketIoConfig = { url: 'https://gameshow.flayinahook.de/', options: {}, };


@NgModule({
  declarations: [
    AppComponent,
    BuzzGameComponent,
    BuzzHostComponent,
    DndDirective,
    CreateGameComponent,
    SortHostComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
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
