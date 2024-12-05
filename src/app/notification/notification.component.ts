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

  constructor(
    private websocketService: WebsocketService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.websocketService.listen('notification').subscribe((data: { message: string; }) => {
      this.notifications.push(data);
      this.showToast(data.message);
      this.playSound();
    });
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }

  playSound() {
    const audio = new Audio('assets/notificacao.mp3');
    audio.play();
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
