import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Provider } from '@shared/models/provider.model';

@Component({
  selector: 'provider-table',
  imports: [RouterLink],
  templateUrl: './provider-table.html',
})
export class ProviderTable implements OnInit {
  providers = input.required<Provider[]>();

  ngOnInit(): void {
    // console.log('ProviderTable.OnInit.input', this.providers());
  }
}
