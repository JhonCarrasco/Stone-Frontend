import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.services';
import { ProviderService } from '../services/providerService';

export function existsInListValidator(
  service: SharedService | ProviderService,
  serviceName: string,
  existsId: number,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    let exists = false;

    switch (serviceName) {
      case 'Providers':
        (service as ProviderService)
          .getProviders({ limit: 0, offset: 0, searchText: 'providers' })
          .subscribe({
            next: (resp) => {
              const listDescription = resp.data.map(
                ({ personName }) => personName,
              );
              exists = listDescription.includes(value);
            },
            error: (err) => {
              console.error('Error fetching providers for validator', err);
            },
          });
        break;

      default:
        (service as SharedService)
          .getShareds(serviceName, {
            limit: 0,
            offset: 0,
            searchText: serviceName,
          })
          .subscribe({
            next: (resp) => {
              const listDescription = resp.data.map(
                ({ description }) => description,
              );
              exists = listDescription.includes(value);
            },
            error: (err) => {
              console.error('Error fetching shareds for validator', err);
            },
          });
        break;
    }
    // const hasUpperCase = /[A-Z]+/.test(value);
    // const hasLowerCase = /[a-z]+/.test(value);
    // const hasNumeric = /[0-9]+/.test(value);
    // const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    // return !passwordValid ? { passwordStrength: true } : null;

    if (existsId > 0 && !exists) {
      // Si existsId es diferente de 0, significa que estamos editando un producto existente
      // En este caso, permitimos que el valor sea igual al del producto que estamos editando
      // para evitar que el validador marque como inválido el valor actual del producto
      return null;
    }
    return { existsInList: true };
  };
}
