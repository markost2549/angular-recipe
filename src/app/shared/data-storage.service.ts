import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http
      .put("https://ng-recipe-book-534e6.firebaseio.com/recipes.json", recipes)
      .subscribe((results) => {
        console.log(results);
      });
  }

  fetchRecipes() {
    this.http
      .get<Recipe[]>("https://ng-recipe-book-534e6.firebaseio.com/recipes.json")
      .subscribe((recipes) => {
        this.recipeService.setRecipes(recipes);
      });
  }
}
