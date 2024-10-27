import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardTitleGroup
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {ScanList} from "../../../services/shared/domain/ScanList";
import {User} from "../../../services/shared/domain/User";
import {ApiServicesInterface} from "../../../services/shared/domain/ApiServiceInterface";
import {ApiService} from "../../../services/shared/infrastructure/ApiService";
import {FormPatrollerComponent} from "../../../organisms/form-patroller/form-patroller.component";
import {Patroller} from "../../../services/dashboard/domain/Patroller";
import {FormUserComponent} from "../../../organisms/form-user/form-user.component";
import {ModalService} from "../../../organisms/modal/ModalService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IAuthService} from "../../../services/auth/domain/IAuthService";
import {ApiAuthService} from "../../../services/auth/infrastructure/ApiAuthService";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatNoDataRow,
    MatTooltipModule,
    MatPaginator,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatCardAvatar,
    MatCardTitleGroup,
    MatSort
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit{
  displayedColumns: string[] = ['name', 'email', 'date'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  constructor(
    private readonly modalService: ModalService,
    private readonly snackBar: MatSnackBar,
    @Inject(ApiAuthService) private readonly authService: IAuthService,
    @Inject(ApiService) private readonly apiService: ApiServicesInterface
  ) { }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(users => {
      this.dataSource.data = users.results
    });
  }

  addUser() {
    const dialogRef = this.modalService.openModal(FormUserComponent, {
      title: 'Add User',
      organizationId: this.authService.getPayload().organizationId
    });

    dialogRef.afterClosed().subscribe((user: User) => {
      if(user == null) {
        return;
      }
      this.dataSource.data = [...this.dataSource.data, user];
      this.snackBar.open('User added successfully', 'Close', { duration: 3000 });
    });

  }
}
