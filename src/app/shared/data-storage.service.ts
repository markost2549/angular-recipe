import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, take, exhaustMap } from "rxjs/operators";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http
      .put("https://ng-recipe-book-534e6.firebaseio.com/recipes.json", recipes)
      .subscribe((results) => {
        console.log(results);
      });
  }

  fetchRecipes() {
    return this.authService.userSub.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>
          ("https://ng-recipe-book-534e6.firebaseio.com/recipes.json", {
            params: new HttpParams().set('auth', user.token),
            // headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.token)
          })
      }),
      map((recipes) => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
