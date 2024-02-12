import { Component } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {
  rows:any;
  title:String ='Country';

  tabClick(tab: string) {
    this.title = tab;
    this.tableData();
  }

  tableData() {
    this.rows = `<div class="card table-responsive">
          <table class="table table-sm table-hover">
              <thead>
                  <tr>
                      <th>Sl No.</th> 
                      <th>Title</th>
                  </tr>
              </thead>
              <tbody>
                  <td>1</td>
                  <td>test</td>
              </tbody>
          </table>
    </div>`
  }

}
