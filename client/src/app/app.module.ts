import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http'; //Este no funciona. Se importa HttpClientModule
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';

// declarations -> Componentes y directivas
// imports -> Modulos del framework o que hagamos nosotros
// providers -> Cargar servicios. Un servicio es una clase dn¡ode habra diferenets metodos interactuando con la api
// bootstrap -> Componente principal
@NgModule({
  declarations: [
    AppComponent, UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
