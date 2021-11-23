import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BillingShippingAddressesPageRoutingModule } from './billing-shipping-addresses-routing.module';
import { BillingShippingAddressesPage } from './billing-shipping-addresses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BillingShippingAddressesPageRoutingModule
  ],
  declarations: [BillingShippingAddressesPage]
})
export class BillingShippingAddressesPageModule {}
