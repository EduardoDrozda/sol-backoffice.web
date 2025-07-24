import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _loadings = signal<Record<string, boolean>>({});

  readonly loadings = this._loadings.asReadonly();

  private update(key: string, value: boolean): void {
    this._loadings.update(loadings => ({
      ...loadings,
      [key]: value
    }));
  }

  start(key: string): void {
    this.update(key, true);
  }

  stop(key: string): void {
    this.update(key, false);
  }

  isLoading(key: string) {
    return this._loadings()[key] ?? false;
  }
}
