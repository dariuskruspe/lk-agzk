type ZERO = 0;
type Iterate<Tuple extends ZERO[]> = [...Tuple, 0];

export type NumbersRange<
  FROM extends number,
  TO extends number
> = TO extends FROM ? FROM : FillStartRange<FROM, TO>;

type FillStartRange<
  FROM extends number,
  TO extends number,
  ITERATOR extends ZERO[] = []
> = ITERATOR['length'] extends FROM
  ? SequenceNumbersRange<TO, ITERATOR>
  : FillStartRange<FROM, TO, Iterate<ITERATOR>>;

type SequenceNumbersRange<
  TO extends number,
  ITERATOR extends ZERO[],
  RESULT extends unknown[] = []
> = ITERATOR['length'] extends TO
  ? [...RESULT, TO][number]
  : SequenceNumbersRange<
      TO,
      Iterate<ITERATOR>,
      [...RESULT, ITERATOR['length']]
    >;
