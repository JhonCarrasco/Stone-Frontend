import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { DriveService } from 'src/app/services/driveService';

@Component({
  selector: 'input-file',
  imports: [],
  templateUrl: './input-file.html',
})
export class InputFile implements OnInit {
  filesInput = input.required<File[]>();
  files = signal<File[]>([]);
  @Output() filesEvent = new EventEmitter<File[]>();
  @Output() removeFileEvent = new EventEmitter<string>();

  driveService = inject(DriveService);

  ngOnInit() {
    this.files.set([...this.filesInput()]);
  }

  onFileSelected(event: Event) {
    const fileInput = (event.target as HTMLInputElement).files;
    const newFiles = fileInput ? Array.from(fileInput) : [];
    // Append new files to the existing array
    const updatedFiles = [...this.files(), ...newFiles];
    this.files.set(updatedFiles);
    // console.log('InputFile.onFileSelected', updatedFiles);
    this.filesEvent.emit(updatedFiles);
  }

  removeFile(index: number) {
    // Omit / remove file from the list by index

    const updatedFiles = this.files().filter((file, i) => {
      if (i === index) {
        // emit the name of the file to be removed
        this.removeFileEvent.emit(file.name);
      }
      return i !== index;
    });
    this.files.set(updatedFiles);
    // console.log('InputFile.removeFile', updatedFiles);
    this.filesEvent.emit(updatedFiles);
  }
}
