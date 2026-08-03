import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModuleEditorComponent } from './components/module-editor/module-editor.component';
import { ReviewComponent } from './components/review/review.component';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent, ModuleEditorComponent, ReviewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'borrower-portal';

  constructor(public stateService: StateService) {}
}
