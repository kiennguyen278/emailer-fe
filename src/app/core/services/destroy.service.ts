import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DestroyService extends Subject<null> implements OnDestroy {
    ngOnDestroy(): void {
        this.next(null);
        this.complete();
    }
}

