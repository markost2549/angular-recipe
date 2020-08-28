import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';



const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' },
  { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
