import {Observable} from "rxjs";
import {Patroller} from "../../dashboard/domain/Patroller";

export interface ApiServicesInterface{

  addPatroller(patroller: Patroller): Observable<any>;

}
