import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
  WritableSignal,
} from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DocumentComponent {
  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  @Input() hasNextDocument: Signal<boolean> | boolean = false;

  @Input() isLoadingNext: Signal<boolean> | boolean = false;
  
  @Input() showNextButton: Signal<boolean> | boolean = false;

  @Output() backPage = new EventEmitter();

  @Output() oncloseFile = new EventEmitter<unknown>();

  @Output() navigateToNext = new EventEmitter<void>();

  onBackPage(): void {
    this.backPage.emit();
  }

  closeFile(result: unknown): void {
    this.oncloseFile.emit(result);
  }

  onNavigateToNext(): void {
    this.navigateToNext.emit();
  }

  get hasNext(): boolean {
    if (typeof this.hasNextDocument === 'function') {
      return this.hasNextDocument();
    }
    return !!this.hasNextDocument;
  }

  get isLoading(): boolean {
    if (typeof this.isLoadingNext === 'function') {
      return this.isLoadingNext();
    }
    return !!this.isLoadingNext;
  }
}
