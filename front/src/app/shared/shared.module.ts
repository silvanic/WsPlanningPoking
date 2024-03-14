import { CommonModule, JsonPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterOutlet } from "@angular/router";
import { RoundPipe } from "./floor.pipe";

@NgModule({
    declarations:[
        RoundPipe
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterOutlet, 
        JsonPipe
    ],
    exports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RoundPipe
    ]
})
export class SharedModule{}