import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

import { ApiService } from './shared/api.service';

@Component({
    selector: 'ink-app',
    templateUrl: './app/app.component.html'
})
export class AppComponent {
    private data: any;
    private items: MenuItem[];

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.data = this.apiService.data;
        this.items = [
            { label: 'User Page', routerLink: ['/user'] }
        ];
    }
}
