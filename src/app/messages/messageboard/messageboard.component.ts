import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  batchMap: Observable<{}>;

  constructor(
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.batchMap = this.offset.pipe(
      throttleTime(5000),
      mergeMap((n) => this.messageService.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite$ = this.batchMap.pipe(map((v) => Object.values(v)));
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
        this.viewport.scrollToIndex(0, 'smooth');
        this.reloadList();
      }
    });
  }
  reloadList() {
    this.offset.next(null);
    this.infinite$ = this.batchMap.pipe(map((v) => Object.values(v)));
  }
}
