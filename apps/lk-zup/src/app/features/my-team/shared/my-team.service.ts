import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Environment } from '@app/shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class MyTeamService {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  loading = signal(false);
  error = signal<string | null>(null);
  data = signal<any>(null);

  mode = computed(() => {
    const data = this.data();

    if (!data) {
      return null;
    }

    if (data.type === 'full') {
      return 'full';
    }

    return 'widgets';
  });

  fullModeUrl = computed(() => {
    const data = this.data();
    const mode = this.mode();

    if (mode !== 'full') {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  });

  widgetModePages = computed(() => {
    const data = this.data();
    const mode = this.mode();

    if (mode !== 'widgets') {
      return null;
    }

    return data;
  });

  init() {
    this.loading.set(true);
    this.http.get<any>(`${Environment.inv().api}/my_team`).subscribe(
      (res) => {
        console.log(res);
        this.data.set(res);
        this.loading.set(false);
      },
      (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    );
  }
}
