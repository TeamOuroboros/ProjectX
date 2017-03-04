﻿import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    ButtonModule,
    DialogModule,
    EditorModule,
    DropdownModule,
    InputTextModule,
    TreeTableModule,
    ContextMenuModule,
    DragDropModule
} from 'primeng/primeng';

import { EditService } from './edit.service';
import { EditComponent } from './edit.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        ButtonModule,
        DialogModule,
        EditorModule,
        DropdownModule,
        InputTextModule,
        TreeTableModule,
        ContextMenuModule,
        DragDropModule
    ],
    providers: [EditService],
    declarations: [EditComponent],
    bootstrap: [EditComponent]
})
export class EditModule { }
