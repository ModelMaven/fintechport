import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  constructor(public stateService: StateService) {}

  public getCompletionWidth(): string {
    return this.stateService.getCompletionPercentage() + '%';
  }

  public getPluralizedRecordType(recordType: string): string {
    // Mimic the original logic: lowercases the recordType and appends 's'
    return `Multiple ${recordType.toLowerCase()}s`;
  }
}
