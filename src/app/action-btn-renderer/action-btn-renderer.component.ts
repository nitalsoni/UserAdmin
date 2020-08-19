import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
  selector: 'app-action-btn-renderer',
  templateUrl: './action-btn-renderer.component.html',
  styleUrls: ['./action-btn-renderer.component.css']
})

export class ActionBtnRendererComponent implements ICellRendererAngularComp {
  public params: any;
  private action: string;

  agInit(params: any): void {
    this.params = params;
    if (this.params.colDef && this.params.colDef.colId) {
      this.action = this.params.colDef.colId;
    }
  }

  public onDelete() {
    debugger;
    this.params.context.componentParent.onDelete(this.params.data);
  }

  public onEdit() {
    this.params.context.componentParent.onEdit(this.params.data);
  }

  refresh(): boolean {
    return false;
  }
}
