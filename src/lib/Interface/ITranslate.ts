export interface ITranslateResult {
  from : string,
  to : string
}

export interface ITranslate {
  translate(keyword : string) : Promise < ITranslateResult >;
  convertToResult(json : any) : ITranslateResult;
}
