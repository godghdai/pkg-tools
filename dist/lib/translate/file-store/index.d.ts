import {Store} from 'tough-cookie';
export class FileCookieStore extends Store {
  constructor(filePath : string);
  isExpired() : boolean;
  isEmpty() : boolean;
}
