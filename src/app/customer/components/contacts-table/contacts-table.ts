import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Contact } from '@shared/models/contact.model';

@Component({
  selector: 'contacts-table',
  imports: [ReactiveFormsModule],
  templateUrl: './contacts-table.html',
})
export class ContactsTable implements OnInit {
  contactsInput = input.required<Contact[]>();
  contacts = signal<Contact[]>([]);
  @Output() contactsEvent = new EventEmitter<Contact[]>();
  router = inject(Router);
  fb = inject(FormBuilder);

  contactForm = this.fb.group({
    id: [null as number | null],
    customerId: [null as number | null],
    active: [null as boolean | null],
    phone: [null as string | null],
    email: [null as string | null],
    displayName: [null as string | null],
    providerId: [null as number | null],
    position: [null as string | null],
  });

  onAddContact() {
    const formValue = this.contactForm.value as Contact;

    const { id } = this.contactForm.value;
    if (id && id > 0) {
      //edit
      const filtered = this.contacts().filter((i) => i.id !== id);
      this.contacts.set([...filtered, formValue]);
      this.contactsEvent.emit(this.contacts());
    } else {
      //add
      this.contacts.set([...this.contacts(), formValue]);
      this.contactsEvent.emit(this.contacts());
    }

    this.resetForm();
  }
  onEditContact(item: Contact) {
    this.contactForm.setValue({ ...item });
  }
  onRemoveContact(item: Contact) {
    const updatedItems = this.contacts().map((i) =>
      i === item ? { ...i, active: false } : i,
    );
    this.contacts.set(updatedItems);
    this.contactsEvent.emit(this.contacts());
  }
  onInputChange(event: Event) {
    const { value, name } = event.target as HTMLSelectElement;
    this.contactForm.patchValue({ [name]: value });
  }

  resetForm() {
    this.contactForm.reset({
      id: 0,
      customerId: 0,
      active: true,
      phone: '',
      email: '',
      displayName: '',
      providerId: 0,
      position: '',
    });
  }

  ngOnInit(): void {
    this.contacts.set([...this.contactsInput()]);
  }
}
