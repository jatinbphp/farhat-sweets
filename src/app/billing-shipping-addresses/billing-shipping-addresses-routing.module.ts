import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingShippingAddressesPage } from './billing-shipping-addresses.page';

const routes: Routes = [
  {
    path: '',
    component: BillingShippingAddressesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingShippingAddressesPageRoutingModule {}
