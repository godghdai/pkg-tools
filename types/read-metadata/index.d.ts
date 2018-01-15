type json = any;

declare namespace metadata {

  export interface readMetadata {
    (path : string, done : (err : Error, data : json) => void) : void;
    sync(path : string) : json
  }
}

declare const readMetadata : metadata.readMetadata;
export = readMetadata;
