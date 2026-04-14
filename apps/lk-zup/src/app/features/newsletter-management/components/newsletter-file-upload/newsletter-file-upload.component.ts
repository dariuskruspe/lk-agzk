import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-newsletter-file-upload',
  imports: [CommonModule],
  templateUrl: './newsletter-file-upload.component.html',
  styleUrl: './newsletter-file-upload.component.scss',
  providers: [],
  standalone: true,
})
export class NewsletterFileUploadComponent {
  dragOver = false;

  file: WritableSignal<
    | {
        fileName: string;
        file64: string | ArrayBuffer;
      }
    | null
  > = signal(null);

  @Input() uploadEnabled: boolean = true;

  @Output() changeFile: EventEmitter<
    {
      fileName: string;
      file64: string | ArrayBuffer;
    }
  > = new EventEmitter();

  loading = signal(false);

  constructor(private ref: ChangeDetectorRef) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i += 1) {
        this.handleFile(input.files[i]);
      }
    }
  }

  handleFile(file: File) {
    this.getBase64(file).then((file64) => {
      const fileName = file.name;
      const fileObj = { fileName, file64 };
      this.file.set(fileObj);
      this.changeFile.emit(this.file());
    });
  }

  getBase64(f: Blob | File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  changeFilesList() {
    this.ref.detectChanges();
  }

  removeFile() {
    this.file.set(null);
    this.ref.detectChanges();
    this.changeFile.emit(this.file());
  }
}
