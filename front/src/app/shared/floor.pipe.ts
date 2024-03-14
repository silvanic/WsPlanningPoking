import { Pipe } from "@angular/core";

@Pipe({
    name: 'round',
    standalone:false    
})
export class RoundPipe {
  transform (input:number) {
    return Math.floor(input);
  }
}