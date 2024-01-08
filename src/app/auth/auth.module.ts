import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "./services/auth.service";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
  providers: [AuthService]
})
export class AuthModule {}
