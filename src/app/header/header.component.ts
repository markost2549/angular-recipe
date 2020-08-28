import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSubsc: Subscription;

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userSubsc = this.authService.userSub.subscribe(user => {
      this.isAuthenticated = !!user  // !user ? false : true;
    });
  }

  onSaveData() {
    this.dataStorage.storeRecipes();
  }

  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubsc.unsubscribe();
  }
}
