import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FileApi } from './core/api/FileApi';
import { BoardApi } from './core/api/BoardApi';

import { BoardsResolver } from './core/resolvers/boards.resolver';

import { HomeComponent } from './pages/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { BoardFormComponent } from './components/board-form/board-form.component';
import { PhotoComponent } from './components/photo/photo.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PhotoComponent,
    FileUploaderComponent,
    ModalComponent,
    BoardFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [FileApi, BoardApi, BoardsResolver],
  bootstrap: [AppComponent],
})
export class AppModule {}
