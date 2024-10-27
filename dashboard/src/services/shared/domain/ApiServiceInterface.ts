import {Observable} from "rxjs";
import {Patroller} from "../../dashboard/domain/Patroller";
import {ApiResponse} from "../infrastructure/ApiResponse";
import {User} from "./User";

export interface ApiServicesInterface{

  addPatroller(patroller: Patroller): Observable<any>;

  getUsers(): Observable<ApiResponse<User[]>>;

  addUser(updatedUser: User): Observable<void>
}
