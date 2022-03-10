import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { UsersService } from "./_services/user.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: [
    "./users-list.component.scss",
    "/assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // row data
  public rows = [];//usersListData;
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  // column header
  public columns = [
    { name: "CORPORATIVO", prop: "S_NombreCorto" },
    { name: "URL", prop: "S_LogoURL" },
    { name: "INCORPORACION", prop: "D_FechaIncorporacion" },
    { name: "CREADO EL", prop: "created_at" },
    { name: "ASIGNADO A", prop: "asignado" },
    { name: "Status", prop: "S_Activo" },
    { name: "ACCIONES", prop: "ACCIONES" },
  ];

  // private
  private tempData = [];

  suscritions: Subscription[] = []

  constructor(
    private usersService:UsersService,
    private spinner: NgxSpinnerService) {
    //this.tempData = usersListData;
    this.spinner.show();
    this.suscritions[0] = usersService.getUsers().subscribe(r => {
      this.tempData = r.data;
      this.rows = r.data;
      setTimeout(() => {
        this.spinner.hide();
      }, 3000);
    });
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.Username.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * updateLimit
   *
   * @param limit
   */
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.suscritions.forEach(suscrition => {
      suscrition.unsubscribe();
    })
  }
}
