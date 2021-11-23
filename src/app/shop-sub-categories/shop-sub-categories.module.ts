import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopSubCategoriesPageRoutingModule } from './shop-sub-categories-routing.module';

import { ShopSubCategoriesPage } from './shop-sub-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopSubCategoriesPageRoutingModule
  ],
  declarations: [ShopSubCategoriesPage]
})
export class ShopSubCategoriesPageModule {}
