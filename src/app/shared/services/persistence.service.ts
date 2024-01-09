import {Injectable} from "@angular/core";

@Injectable()
export class PersistenceService {
  setCookie(name: string, data: any): void {
    try {
      document.cookie = [name, '=', JSON.stringify(data)].join('')
    }
    catch (e) {
      console.log('Error saving to Coolie', e)
    }
  }

}
