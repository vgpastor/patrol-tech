export enum Country{
  USA = 'USA',
  CANADA = 'CANADA',
  MEXICO = 'MEXICO',
  UK = 'UK',
  GERMANY = 'GERMANY',
  FRANCE = 'FRANCE',
  ITALY = 'ITALY',
  SPAIN = 'ESPAÑA',
  PORTUGAL = 'PORTUGAL',
  SWITZERLAND = 'SWITZERLAND',
  SWEDEN = 'SWEDEN',
  NORWAY = 'NORWAY',
  FINLAND = 'FINLAND',
  DENMARK = 'DENMARK',
  NETHERLANDS = 'NETHERLANDS',
  BELGIUM = 'BELGIUM',
  LUXEMBOURG = 'LUXEMBOURG',
  IRELAND = 'IRELAND',
  ICELAND = 'ICELAND',
  AUSTRIA = 'AUSTRIA',
  POLAND = 'POLAND',
  CZECH_REPUBLIC = 'CZECH_REPUBLIC',
  SLOVAKIA = 'SLOVAKIA',
  HUNGARY = 'HUNGARY',
  SLOVENIA = 'SLOVENIA',
  CROATIA = 'CROATIA',
  BOSNIA = 'BOSNIA',
  SERBIA = 'SERBIA',
}

export namespace Country {
  export function values() {
    return Object.keys(Country).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
