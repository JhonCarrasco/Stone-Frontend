import {
  BankAccount,
  Location,
} from './../../../../../shared/models/contact.model';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { Contact } from '@shared/models/contact.model';
import { Person } from '@shared/models/person.model';
import { Provider } from '@shared/models/provider.model';
import { firstValueFrom } from 'rxjs';
import { typePersonData } from 'src/app/constant/typePersonData';
import { ContactsTable } from 'src/app/customer/components/contacts-table/contacts-table';
import { ProviderService } from 'src/app/services/providerService';
import { SharedService } from 'src/app/services/shared.services';

@Component({
  selector: 'provider-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, ContactsTable],
  templateUrl: './provider-details.html',
})
export class ProviderDetails implements OnInit {
  objInput = input.required<Provider>();
  router = inject(Router);
  fb = inject(FormBuilder);
  sharedService = inject(SharedService);
  providerService = inject(ProviderService);
  wasSaved = signal(false);
  typePersonData = signal(typePersonData);

  form = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
    rut: [''],
    email: [''],
    displayName: [''],
    phone: [''],
    person: [{} as Person | null],
    location: [{} as Location],
    bankAccount: [{} as BankAccount],
    accountNumber: null,
    contacts: [[] as Contact[]],
    typePersonId: null,
    businessActivity: [null as string | null],
    address: null,
    communeId: null,
    regionId: null,
    bankId: null,
    typeAccountId: null,
  });

  communesResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Communes',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/Communes', {
        limit: request.limit,
        offset: 0,
        searchText: 'Communes',
      });
    },
  });

  regionsResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Regions',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/Regions', {
        limit: request.limit,
        offset: 0,
        searchText: 'Regions',
      });
    },
  });

  banksResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'Banks',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/Banks', {
        limit: request.limit,
        offset: 0,
        searchText: 'Banks',
      });
    },
  });

  typeAccountsResource = rxResource({
    request: () => ({
      page: 0,
      limit: 0,
      searchText: 'TypeAccounts',
    }),
    loader: ({ request }) => {
      return this.sharedService.getShareds('shareds/TypeAccounts', {
        limit: request.limit,
        offset: 0,
        searchText: 'TypeAccounts',
      });
    },
  });

  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.form.patchValue({ [name]: value });
  }

  onSelectedChange(event: Event) {
    const { name, value } = event.target as HTMLSelectElement;
    // console.log('onSelectedChange', name, value);
    this.form.patchValue({ [name]: value });
  }

  onContactsChange(event: Contact[]) {
    // actualizar en form
    this.form.patchValue({
      contacts: event,
    });

    // actualizar input
    this.objInput().contacts = event;
  }

  setFormValue(formLike: Partial<Provider>) {
    this.form.patchValue(formLike as any);
    this.form.patchValue({
      rut: formLike.person?.rut,
      displayName: formLike.person?.displayName,
      typePersonId: formLike.person?.typePerson,
      address: formLike.location?.address,
      regionId: formLike.location?.regionId,
      communeId: formLike.location?.communeId,
      bankId: formLike.bankAccount?.bank?.id,
      typeAccountId: formLike.bankAccount?.typeAccount?.id,
      accountNumber: formLike.bankAccount?.accountNumber,
    });

    // console.log('ProviderDetails.setFormValue.form', this.form.value);
  }

  ngOnInit(): void {
    // console.log('ProviderDetails.ngOnInit.objInput', this.objInput());
    this.setFormValue(this.objInput());
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value as Partial<Provider>;

    const objLike: Partial<Provider> = {
      ...formValue,
      typePersonId: formValue.typePersonId
        ? Number(formValue.typePersonId)
        : null,
    };

    // console.log('ProviderDetails.onSubmit.objInput', this.objInput());
    // console.log('ProviderDetails.onSubmit.formValue', formValue);
    // console.log('ProviderDetails.onSubmit.objLike', objLike);

    if (this.objInput().id == 0) {
      // Crear presupuesto
      const response = await firstValueFrom(
        this.providerService.create(objLike /* , this.imageFileList */),
      );

      this.router.navigate(['/admin/provider', response.data]);
    } else {
      const inputId = this.objInput()?.id ?? 0;
      await firstValueFrom(
        this.providerService.update(
          inputId.toString(),
          objLike,
          /* this.imageFileList */
        ),
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
