﻿import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    MenuModule,
    SharedModule,
    EditorModule,
    TreeTableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule
} from 'primeng/primeng';
import { WikiService } from './wiki.service';
import { WikiComponent } from './wiki.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MenuModule,
        SharedModule,
        EditorModule,
        TreeTableModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        ConfirmDialogModule
    ],
    providers: [WikiService],
    declarations: [WikiComponent],
    bootstrap: [WikiComponent]
})
export class WikiModule { }