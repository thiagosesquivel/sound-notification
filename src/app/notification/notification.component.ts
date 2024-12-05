import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [MessageService],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  isPageVisible: boolean = true; 

  constructor(
    private websocketService: WebsocketService,
    private messageService: MessageService
  ) {}

  ngOnInit() {

    document.addEventListener('visibilitychange', this?.checkVisibility);


    this.websocketService.listen('notification').subscribe((data: { message: string; }) => {
      this.notifications.push(data);
      this.showToast(data.message);
      if (!this.isPageVisible) {
        this.playSound();
      }
    });
    console.log(this.isPageVisible)
  }
  

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.checkVisibility.bind(this));
    this.websocketService.disconnect();
  }

  playSound() {
    const audio = new Audio('assets/notificacao.mp3');
    audio.play();
  }

  checkVisibility = () => {
    this.isPageVisible = document.visibilityState === 'visible';
  }


  showToast(message: string) {
    this.messageService.add({
      severity: 'info', // Tipos: success, info, warn, error
      summary: 'Nova Notificação',
      detail: message,
      life: 3000, // Duração em milissegundos
    });
  }
}
