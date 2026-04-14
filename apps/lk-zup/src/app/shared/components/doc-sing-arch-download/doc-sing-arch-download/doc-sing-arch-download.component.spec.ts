import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocSingArchDownloadComponent } from './doc-sing-arch-download.component';

describe('DocSingArchDownloadComponent', () => {
  let component: DocSingArchDownloadComponent;
  let fixture: ComponentFixture<DocSingArchDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocSingArchDownloadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSingArchDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
