import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "./services/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {PersistenceService} from "../shared/services/persistence.service";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
  providers: [AuthService, PersistenceService]
})
export class AuthModule {}
