﻿import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../shared/api.service';

@Injectable()
export class LoginService {
    private url: string;
    private options = new RequestOptions({ withCredentials: true });

    constructor(private apiService: ApiService, private http: Http) {
        this.url = apiService.authentication ?
            'http://inkweaver.plotypus.net:8080/api' : 'http://localhost:8080/api';
    }

    public login(username: string, password: string): Observable<Response> {
        return this.http.post(this.url + '/login', {
            username: username,
            password: password
        }, this.options);
    }

    public register(username: string, password: string, email: string, name: string, bio: string) {
        return this.http.post(this.url + '/signup', {
            username: username,
            password: password,
            name: name, email: email, bio: bio
        }, this.options);
    }
}
