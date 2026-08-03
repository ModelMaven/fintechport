import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService, ModuleMetadata } from '../../services/state.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html'
})
export class ReviewComponent {
  constructor(public stateService: StateService) {}

  public getRecordCount(mName: string): number {
    const data = this.stateService.getModuleData(mName);
    return data.records ? data.records.length : 0;
  }

  public getStatusText(mName: string): string {
    const recordsCount = this.getRecordCount(mName);
    const data = this.stateService.getModuleData(mName);
    const hasTable = data.table && data.table.length > 0;
    
    if (mName === 'About Borrowing Entity and Group') {
      const group = this.stateService.state.groupTables;
      const groupHasData = group && (group.shareholders.length > 0 || group.beneficiaries.length > 0 || group.directors.length > 0);
      return (recordsCount || groupHasData || hasTable) ? 'Started' : 'Not started';
    }
    
    if (mName === 'Family Chart') {
      const family = this.stateService.state.familyTree;
      return (family && family.people.length > 0) ? 'Started' : 'Not started';
    }
    
    if (mName === 'Cost of Project and Means of Finance') {
      return 'Started'; // Has defaults
    }

    return (recordsCount > 0 || hasTable) ? 'Started' : 'Not started';
  }

  public mockAction(action: string): void {
    alert(`${action} triggered. In a production environment, this will generate the document matching your edited project note.`);
  }
}
