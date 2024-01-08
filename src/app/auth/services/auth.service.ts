import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LoginRequestInterface} from "../types/loginRequest.interface";
import {CurrentUserInterface} from "../types/currentUser.interface";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = "http://51.158.107.27:82/api/login"

    return this.http.post<any>(url, data)
  }
}
