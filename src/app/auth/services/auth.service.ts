import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequestInterface} from "../types/loginRequest.interface";
import {CurrentUserInterface} from "../types/currentUser.interface";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(url: string, data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const myHeaders = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<CurrentUserInterface>(url, data, {headers: myHeaders})
  }
}
