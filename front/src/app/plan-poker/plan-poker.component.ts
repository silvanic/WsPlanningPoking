import { Component, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { MyService } from '../services/myService.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isValidCustomSuit } from '../validators/custom-suit.validator';
import { WebsocketService } from '../services/ws.service';

enum EnumEvent{
  updateStatus= "update_status",
  vote= "vote",
  updateInfo= "update_info"
}

@Component({
  selector: 'app-plan-poker',
  templateUrl: './plan-poker.component.html',
  styleUrl: './plan-poker.component.scss',
})
export class PlanPokerComponent {
  connected = false;
  suits = [
    {
      name: 'Default',
      cards: '1;2;3;5;8;13;21;34;50;?'
    },
    {
      name: 'Simple',
      cards: '1;2;3;4;5;6;7;8;9;?',
    },
    {
      name: 'Jumbo',
      cards: '10;20;50;100;200;500;?',
    },
    {
      name: 'T-shirt Sizing',
      cards: 'XS;S;M;L;XL;XXL;?',
    },
  ];
  data: any = {};
  vote = '';
  userId = null;
  roomId = null;
  currentDate: number= Date.now();

  identityForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    roomName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    suit: new FormControl(this.suits[0].cards),
    customSuit: new FormControl(this.suits[0].cards, [isValidCustomSuit(";")])
  });
  
  optionForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    url: new FormControl(''),
  });
  
  openSidenav = false;
  dialogRef?: any;
  snackBarRef: any; 
  
  constructor(
    private myService: MyService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private wsService: WebsocketService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id && id.toString().length > 0) {
      this.myService.getRoom(id).subscribe((data) => {
        if (data.body.room) {
          this.roomId = data.body.room.id;
          this.identityForm.setValue({
            userName: '',
            roomName: data.body.room.name,
            suit: '',
            customSuit:null
          });
          this.identityForm.get('roomName')?.disable();
        }
      });
    }
    this.identityForm.get('suit')?.valueChanges.subscribe(selectedValue => {
      if(selectedValue!=='custom'){
        this.identityForm.get('customSuit')?.setValue(null);
      }
    });
  }

  submit() {
    if (this.identityForm.value.userName) {
      const suit = this.identityForm.value.suit && this.identityForm.value.suit!= 'custom' 
        ? this.identityForm.value.suit
        : this.identityForm.value.customSuit ?? '';
      this.myService
        .login(
          this.identityForm.value.roomName ?? '',
          this.identityForm.value.userName,
          suit,
          this.roomId
        )
        .subscribe((data: any) => {
          this.roomId = data.room.id;
          this.userId = data.userId;
          if(this.roomId&&this.userId){
            this.connected = true;
            this.data=data.room;
            this.wsService.connect(environment.wsUrl.replace(':room', this.roomId).replace(':user', this.userId));
            this.wsService.message.subscribe((data)=>{
              this.data=JSON.parse(data);
              this.optionForm.setValue({
                name:this.data.name,
                description:this.data.description,
                url: this.data.url
              })
            })
          }
        });
    }
  }

  passer() {
    if (this.roomId) {
      const message = {
        event:EnumEvent.updateStatus
      };
      this.wsService.sendMessage(message);
    }
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  openDialog(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: '75%',
      ariaLabel: 'Room configuration modal',
    });
  }

  updateSalle() {
    console.log(this.optionForm);
    if (this.roomId && this.optionForm.valid) {
      const message = {
        event: EnumEvent.updateInfo,
        name: this.optionForm.value.name,
        description: this.optionForm.value.description,
        url: this.optionForm.value.url
      }
      this.wsService.sendMessage(message);
      this.dialogRef.close();
    }
  }

  onVoted(value: string) {
    if (this.roomId && this.userId) {
      this.vote = value;
      let index = this.data.users.findIndex((user:any)=>user.id===this.userId);
      if(index!==-1){
        this.data.users[index].vote=value;
      }
      const message = {
        event: EnumEvent.vote,
        vote: value
      }
      this.wsService.sendMessage(message)
    }
  }

  share(templateRef: TemplateRef<any>) {
    if (this.roomId) {
      const url = window.location.origin + '/' + this.roomId;
      navigator.clipboard.writeText(url).then(
        () => {
          this._snackbar.open('Link saved in the clipboard', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
          });
        },
        () => {
          this._snackbar.open(
            'Error happend while saving in the clipboard',
            'Fermer',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
            }
          );
        }
      );
    }
  }
}
