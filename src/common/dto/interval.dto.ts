export class IntervalDto {
  constructor(init?: Partial<IntervalDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  startTime: string;

  endTime: string;
}
