import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'app-voucher-details',
  imports: [],
  templateUrl: './voucher-details.html',
})
export class VoucherDetails {
  objInput = input.required<MaterialGuideGeneric>();
  router = inject(Router);
  fb = inject(FormBuilder);
  materialService = inject(MaterialService);
  wasSaved = signal(false);

  form = this.fb.group({
    id: [0],
    active: [true],
    createAt: [null as Date | null],
    updatedAt: [null as Date | null],
  });

  setFormValue(formLike: Partial<MaterialGuideGeneric>) {
    this.form.reset(this.objInput() as MaterialGuideGeneric);
    this.form.patchValue(formLike as any);
  }

  ngOnInit(): void {
    this.setFormValue(this.objInput());
    console.log('VoucherDetails.ngOnInit.objInput', this.objInput());
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<MaterialGuideGeneric> = {
      ...(formValue as MaterialGuideGeneric),
    };

    console.log('VoucherDetails.onSubmit.objInput', this.objInput());
    console.log('VoucherDetails.onSubmit.objLike', objLike);
    console.log('VoucherDetails.onSubmit.formValue', formValue);

    // if (this.objInput().id == 0) {
    //   // Crear presupuesto
    //   const response = await firstValueFrom(
    //     this.materialService.createMaterial(
    //       objLike,
    //       'materials/voucher' /* , this.imageFileList */,
    //     ),
    //   );

    //   this.router.navigate(['/admin/materials/voucher', response.data]);
    // } else {

    //   await firstValueFrom(
    //     this.materialService.updateMaterial(
    //       this.objInput().id.toString(),
    //       objLike,
    //       'materials/voucher',
    //       /* this.imageFileList */
    //     ),
    //   );
    // }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
