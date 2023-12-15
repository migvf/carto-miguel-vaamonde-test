export interface ApiService{
  calculateApiLimit(requestLimit:string):number;
  calculateApiOffset(requestOffset:string):number;
}