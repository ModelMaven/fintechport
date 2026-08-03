import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService, ModuleMetadata, ModuleData, FamilyPerson } from '../../services/state.service';

@Component({
  selector: 'app-module-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-editor.component.html'
})
export class ModuleEditorComponent {
  // Form models
  public recordName = '';
  public reference = '';
  public details = '';

  // Family chart form models
  public newFamilyName = '';
  public newFamilyRelation = 'Spouse';
  public newFamilyParent = '';

  constructor(public stateService: StateService) {}

  public get activeModule(): ModuleMetadata {
    return this.stateService.modules.find(m => m.name === this.stateService.activeModuleName) || this.stateService.modules[0];
  }

  public get moduleData(): ModuleData {
    return this.stateService.getModuleData(this.activeModule.name);
  }

  public get tableHeaders(): string[] {
    return this.stateService.tableSchemas[this.activeModule.name] || [];
  }

  public get isGroupModule(): boolean {
    return this.activeModule.name === 'About Borrowing Entity and Group';
  }

  public get isCostModule(): boolean {
    return this.activeModule.name === 'Cost of Project and Means of Finance';
  }

  public get isFamilyModule(): boolean {
    return this.activeModule.name === 'Family Chart';
  }

  public addRecord(): void {
    const name = this.recordName.trim() || `${this.activeModule.recordType} ${this.moduleData.records.length + 1}`;
    const desc = this.details.trim();
    this.moduleData.records.push({ name, details: desc });
    this.recordName = '';
    this.reference = '';
    this.details = '';
    this.stateService.save();
  }

  public removeRecord(index: number): void {
    this.moduleData.records.splice(index, 1);
    this.stateService.save();
  }

  // Table functions
  public getTableRows(): string[][] {
    const headers = this.tableHeaders;
    if (!this.moduleData.table) {
      this.moduleData.table = [headers.map(() => '')];
    }
    return this.moduleData.table;
  }

  public addTableRow(): void {
    const row = this.tableHeaders.map(() => '');
    if (!this.moduleData.table) {
      this.moduleData.table = [];
    }
    this.moduleData.table.push(row);
    this.stateService.save();
  }

  public deleteTableRow(index: number): void {
    if (this.moduleData.table) {
      this.moduleData.table.splice(index, 1);
      this.stateService.save();
    }
  }

  public onCellInput(r: number, c: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (this.moduleData.table) {
      this.moduleData.table[r][c] = val;
      this.stateService.save();
    }
  }

  // Group table functions
  public getGroupTable(key: 'shareholders' | 'beneficiaries' | 'directors'): string[][] {
    const group = this.stateService.state.groupTables;
    return group ? group[key] : [];
  }

  public onGroupCellInput(key: 'shareholders' | 'beneficiaries' | 'directors', r: number, c: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const group = this.stateService.state.groupTables;
    if (group) {
      group[key][r][c] = val;
      this.stateService.save();
    }
  }

  public addGroupRow(key: 'shareholders' | 'beneficiaries' | 'directors'): void {
    const group = this.stateService.state.groupTables;
    if (group) {
      const size = key === 'shareholders' ? 3 : key === 'beneficiaries' ? 2 : 3;
      group[key].push(Array(size).fill(''));
      this.stateService.save();
    }
  }

  public deleteGroupRow(key: 'shareholders' | 'beneficiaries' | 'directors', index: number): void {
    const group = this.stateService.state.groupTables;
    if (group) {
      group[key].splice(index, 1);
      this.stateService.save();
    }
  }

  // Family chart functions
  public getRootPeople(): FamilyPerson[] {
    const family = this.stateService.state.familyTree;
    return family ? family.people.filter(p => !p.parent) : [];
  }

  public getChildren(parentId: string): FamilyPerson[] {
    const family = this.stateService.state.familyTree;
    return family ? family.people.filter(p => p.parent === parentId) : [];
  }

  public getAllPeople(): FamilyPerson[] {
    const family = this.stateService.state.familyTree;
    return family ? family.people : [];
  }

  public addFamilyMember(): void {
    const name = this.newFamilyName.trim();
    if (!name) return;
    const family = this.stateService.state.familyTree;
    if (family) {
      family.people.push({
        id: String(family.next++),
        name,
        relation: this.newFamilyRelation,
        parent: this.newFamilyParent
      });
      this.newFamilyName = '';
      this.newFamilyParent = '';
      this.stateService.save();
    }
  }

  public deleteFamilyMember(id: string): void {
    const family = this.stateService.state.familyTree;
    if (family) {
      // Remove the person
      family.people = family.people.filter(p => p.id !== id);
      // Orphan their children (link to empty) or remove them too. Let's make children root nodes.
      family.people.forEach(p => {
        if (p.parent === id) p.parent = '';
      });
      this.stateService.save();
    }
  }

  // Cost calculator cell updates
  public onCostCellInput(phase: 'phase1' | 'phase2', idx: number, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    const calc = this.stateService.state.costCalculation;
    if (calc) {
      calc[phase][idx] = val;
      this.stateService.save();
    }
  }

  // File selected drops
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.stateService.state.files = (this.stateService.state.files || 0) + input.files.length;
      this.stateService.save();
    }
  }
}
