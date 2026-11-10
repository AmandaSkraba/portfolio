import { Component } from '@angular/core';
import { MagneticDirective, ScrambleDirective } from '../../core/fx.service';
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MagneticDirective, ScrambleDirective],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']

})
export class HeaderComponent { }
