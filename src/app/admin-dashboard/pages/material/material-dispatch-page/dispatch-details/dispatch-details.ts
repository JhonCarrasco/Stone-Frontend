import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialGuideGeneric } from '@shared/models/material.model';
import { MaterialService } from 'src/app/services/materialService';

@Component({
  selector: 'app-dispatch-details',
  imports: [],
  templateUrl: './dispatch-details.html',
})
export class DispatchDetails {
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
    console.log('DispatchDetails.ngOnInit.objInput', this.objInput());
  }

  async onSubmit() {
    const isValid = this.form.valid;
    this.form.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.form.value;

    const objLike: Partial<MaterialGuideGeneric> = {
      ...(formValue as MaterialGuideGeneric),
    };

    console.log('DispatchDetails.onSubmit.objInput', this.objInput());
    console.log('DispatchDetails.onSubmit.objLike', objLike);
    console.log('DispatchDetails.onSubmit.formValue', formValue);

    // if (this.objInput().id == 0) {
    //   // Crear presupuesto
    //   const response = await firstValueFrom(
    //     this.materialService.createMaterial(
    //       objLike,
    //       'materials/dispatch' /* , this.imageFileList */,
    //     ),
    //   );

    //   this.router.navigate(['/admin/materials/dispatch', response.data]);
    // } else {

    //   await firstValueFrom(
    //     this.materialService.updateMaterial(
    //       this.objInput().id.toString(),
    //       objLike,
    //       'materials/dispatch',
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
