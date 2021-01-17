import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, scan, throttle, throttleTime } from 'rxjs/operators';
import { MessageDialogComponent } from '../dialogs/message-dialog.component';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messageboard',
  templateUrl: './messageboard.component.html',
  styleUrls: ['./messageboard.component.scss'],
})
export class MessageboardComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  offset = new BehaviorSubject<any>(null);
  infinite$: Observable<any[]>;
  theEnd = false;

  constructor(
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap((n) => this.messageService.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite$ = batchMap.pipe(map((v) => Object.values(v)));
  }

  ngOnInit(): void {
    this.messageService.theEnd.subscribe((value) => (this.theEnd = value));
  }

  nextBatch(e: any, offset: any) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(index: number): number {
    return index;
  }

  openMessageDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.messageService.addMessage({
          header: result.header,
          text: result.text,
        });
      }
    });
  }
}
