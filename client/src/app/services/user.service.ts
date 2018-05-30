import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
    public url: string;
    
    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    signup(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }
        var json = JSON.stringify(user_to_login);
        var params = json;
        var headers = new Headers({'content-Type':'application/json'});
        return this._http.post(this.url+'login',params,{headers}).pipe(map(res => res.json()));
    }
}