declare namespace ttytable {
  export interface ITable {
    render() : string;
  }
  export interface Table {
    (...arr : any[]) : ITable
  }
}
declare const table : ttytable.Table;
export = table;
