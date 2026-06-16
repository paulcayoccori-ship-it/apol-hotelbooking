import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userName = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.userName = this.auth.getUserName();
  }

  logout(): void {
    this.auth.logout();
  }
}
